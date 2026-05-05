interface TokenData {
  application_id: string;
  user_id: string;
  is_developer: boolean;
  created_at: number;
  expires_at: number;
}

const REFRESH_THRESHOLD_SECONDS = 15 * 60;
const RETRY_DELAY_MS = 5 * 60 * 1000;

export class ProxyTokenMonitor {
  private timeoutId: number | null = null;
  private enabled: boolean = false;
  private onRefreshNeeded?: () => Promise<unknown>;

  private parseTokenCookie(): TokenData | null {
    if (typeof document === 'undefined') return null;

    let token: string | undefined;
    for (const rawCookie of document.cookie.split(';')) {
      const cookie = rawCookie.trim();
      const eq = cookie.indexOf('=');
      if (eq === -1) continue;
      if (cookie.slice(0, eq) === 'discord_proxy_token') {
        token = cookie.slice(eq + 1);
        break;
      }
    }
    if (!token) return null;

    try {
      const [payloadB64] = token.split('.');
      if (!payloadB64) return null;

      const payloadJson =
        typeof Buffer !== 'undefined' ? Buffer.from(payloadB64, 'base64').toString('utf-8') : atob(payloadB64);

      return JSON.parse(payloadJson) as TokenData;
    } catch {
      return null;
    }
  }

  private calculateTimeUntilRefresh(tokenData: TokenData): number {
    const now = Math.floor(Date.now() / 1000);
    const refreshTime = tokenData.expires_at - REFRESH_THRESHOLD_SECONDS;
    return Math.max(0, (refreshTime - now) * 1000);
  }

  private scheduleRefresh(): void {
    const tokenData = this.parseTokenCookie();
    if (!tokenData || !this.enabled) return;

    const oldExpiresAt = tokenData.expires_at;
    const msUntilRefresh = this.calculateTimeUntilRefresh(tokenData);

    this.timeoutId = window.setTimeout(async () => {
      if (!this.enabled) return;

      try {
        await this.onRefreshNeeded?.();
      } catch {
        // fall through to expiry check; a thrown callback is treated as a failed refresh
      }
      if (!this.enabled) return;

      const newTokenData = this.parseTokenCookie();
      if (newTokenData && newTokenData.expires_at > oldExpiresAt) {
        this.scheduleRefresh();
      } else {
        this.timeoutId = window.setTimeout(() => this.scheduleRefresh(), RETRY_DELAY_MS);
      }
    }, msUntilRefresh);
  }

  public enable(onRefreshNeeded: () => Promise<unknown>): void {
    if (this.enabled || typeof window === 'undefined') return;

    this.onRefreshNeeded = onRefreshNeeded;
    this.enabled = true;

    this.scheduleRefresh();
  }

  public disable(): void {
    if (!this.enabled) return;

    this.enabled = false;
    if (this.timeoutId != null && typeof window !== 'undefined') {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export type {TokenData};
