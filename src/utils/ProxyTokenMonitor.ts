interface TokenData {
  application_id: string;
  user_id: string;
  is_developer: boolean;
  created_at: number;
  expires_at: number;
}

export class ProxyTokenMonitor {
  private refreshThreshold: number = 15 * 60; // 15 minutes before expiry (in seconds)
  private timeoutId: number | null = null;
  private enabled: boolean = false;
  private onRefreshNeeded?: (tokenData: TokenData) => Promise<boolean>;

  private parseTokenCookie(): TokenData | null {
    if (typeof document === 'undefined') return null;

    const cookies = document.cookie.split(';').reduce(
      (acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    const token = cookies['discord_proxy_token'];
    if (!token) return null;

    try {
      const [, payloadB64] = token.split('.');
      if (!payloadB64) return null;

      let payloadJson: string;
      if (typeof Buffer !== 'undefined') {
        payloadJson = Buffer.from(payloadB64, 'base64').toString('utf-8');
      } else {
        payloadJson = atob(payloadB64);
      }

      return JSON.parse(payloadJson) as TokenData;
    } catch {
      return null;
    }
  }

  private calculateTimeUntilRefresh(tokenData: TokenData): number {
    const now = Math.floor(Date.now() / 1000);
    const refreshTime = tokenData.expires_at - this.refreshThreshold;
    const msUntilRefresh = (refreshTime - now) * 1000;

    // If token needs refresh now or very soon, refresh immediately
    return Math.max(0, msUntilRefresh);
  }

  private scheduleRefresh(): void {
    const tokenData = this.parseTokenCookie();
    if (!tokenData || !this.enabled) return;

    const msUntilRefresh = this.calculateTimeUntilRefresh(tokenData);

    this.timeoutId = window.setTimeout(async () => {
      if (!this.enabled) return;

      // Get fresh token data in case it changed
      const currentTokenData = this.parseTokenCookie();
      if (!currentTokenData) return;

      // Trigger refresh and wait for result
      const refreshed = await this.onRefreshNeeded?.(currentTokenData);

      // If refresh succeeded, schedule the next refresh with the new token
      if (refreshed) {
        // Small delay to ensure new token is available in cookies
        setTimeout(() => this.scheduleRefresh(), 1000);
      } else {
        // If refresh failed, try again in 5 minutes
        this.timeoutId = window.setTimeout(() => this.scheduleRefresh(), 5 * 60 * 1000);
      }
    }, msUntilRefresh);
  }

  public enable(onRefreshNeeded?: (tokenData: TokenData) => Promise<boolean>): void {
    if (this.enabled || typeof window === 'undefined') return;

    this.onRefreshNeeded = onRefreshNeeded;
    this.enabled = true;

    // Schedule the first refresh based on current token
    this.scheduleRefresh();
  }

  public disable(): void {
    if (!this.enabled) return;

    this.enabled = false;
    if (this.timeoutId && typeof window !== 'undefined') {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export type {TokenData};
