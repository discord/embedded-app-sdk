/**
 * @jest-environment jsdom
 */
import {ProxyTokenMonitor, TokenData} from '../ProxyTokenMonitor';

describe('ProxyTokenMonitor', () => {
  let monitor: ProxyTokenMonitor;
  let mockOnRefreshNeeded: jest.Mock;

  beforeEach(() => {
    monitor = new ProxyTokenMonitor();
    mockOnRefreshNeeded = jest.fn().mockResolvedValue(undefined);
    jest.clearAllTimers();
    jest.useFakeTimers();

    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  afterEach(() => {
    monitor.disable();
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Token format produced by the proxy: base64(JSON payload).base64(signature)
  // See discord_static/worker/routes/application-router-domain/proxyAuth.tsx
  const createValidToken = (expiresIn: number = 3600, overrides: Partial<TokenData> = {}): string => {
    const payload: TokenData = {
      application_id: '12345',
      user_id: '67890',
      is_developer: false,
      created_at: Math.floor(Date.now() / 1000),
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
      ...overrides,
    };

    const payloadB64 = btoa(JSON.stringify(payload));
    const signature = btoa('mock-signature');

    return `${payloadB64}.${signature}`;
  };

  describe('token parsing', () => {
    it('parses a token from cookies', () => {
      const token = createValidToken(3600);
      document.cookie = `discord_proxy_token=${token}`;

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      const tokenData = parseTokenCookie();

      expect(tokenData).toMatchObject({
        application_id: '12345',
        user_id: '67890',
        is_developer: false,
      });
      expect(tokenData.expires_at).toBeGreaterThan(Math.floor(Date.now() / 1000));
    });

    it('parses a token whose value contains base64 = padding', () => {
      // Construct a payload sized so its base64 has = padding
      const payload = {
        application_id: '12345',
        user_id: '67890',
        is_developer: false,
        created_at: 1000,
        expires_at: 9999,
      };
      const payloadB64 = btoa(JSON.stringify(payload));
      // Sanity: standard base64 of this JSON ends with '=' padding
      expect(payloadB64.endsWith('=')).toBe(true);

      const token = `${payloadB64}.${btoa('sig')}`;
      document.cookie = `discord_proxy_token=${token}`;

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      const tokenData = parseTokenCookie();

      expect(tokenData).toMatchObject(payload);
    });

    it('returns null when no token cookie exists', () => {
      document.cookie = 'other_cookie=value';

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      expect(parseTokenCookie()).toBeNull();
    });

    it('returns null for malformed token', () => {
      document.cookie = 'discord_proxy_token=invalid-token';

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      expect(parseTokenCookie()).toBeNull();
    });

    it('returns null when payload segment is empty', () => {
      document.cookie = 'discord_proxy_token=.signature';

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      expect(parseTokenCookie()).toBeNull();
    });

    it('parses the correct cookie when other cookies are present', () => {
      const token = createValidToken(3600);
      document.cookie = `other=foo; discord_proxy_token=${token}; another=bar`;

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      expect(parseTokenCookie()).toMatchObject({application_id: '12345'});
    });
  });

  describe('time calculation', () => {
    it('returns 0 for tokens already inside the refresh window', () => {
      const tokenData: TokenData = {
        application_id: '12345',
        user_id: '67890',
        is_developer: false,
        created_at: Math.floor(Date.now() / 1000),
        expires_at: Math.floor(Date.now() / 1000) + 600,
      };

      const calculateTimeUntilRefresh = (monitor as any).calculateTimeUntilRefresh.bind(monitor);
      expect(calculateTimeUntilRefresh(tokenData)).toBe(0);
    });

    it('schedules 15 minutes before expiry', () => {
      const tokenData: TokenData = {
        application_id: '12345',
        user_id: '67890',
        is_developer: false,
        created_at: Math.floor(Date.now() / 1000),
        expires_at: Math.floor(Date.now() / 1000) + 3600,
      };

      const calculateTimeUntilRefresh = (monitor as any).calculateTimeUntilRefresh.bind(monitor);
      expect(calculateTimeUntilRefresh(tokenData)).toBe(45 * 60 * 1000);
    });
  });

  describe('monitoring lifecycle', () => {
    it('enables monitoring and schedules a timeout', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      document.cookie = `discord_proxy_token=${createValidToken(3600)}`;

      monitor.enable(mockOnRefreshNeeded);

      expect(setTimeoutSpy).toHaveBeenCalled();
    });

    it('clears the scheduled timeout on disable', () => {
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
      document.cookie = `discord_proxy_token=${createValidToken(3600)}`;

      monitor.enable(mockOnRefreshNeeded);
      monitor.disable();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('does not enable monitoring twice', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      document.cookie = `discord_proxy_token=${createValidToken(3600)}`;

      monitor.enable(mockOnRefreshNeeded);
      monitor.enable(mockOnRefreshNeeded);

      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    });

    it('triggers refresh immediately when token is already inside the threshold', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      document.cookie = `discord_proxy_token=${createValidToken(600)}`;

      monitor.enable(mockOnRefreshNeeded);

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);
    });

    it('schedules refresh 15 minutes before future expiry', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      document.cookie = `discord_proxy_token=${createValidToken(3600)}`;

      monitor.enable(mockOnRefreshNeeded);

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 45 * 60 * 1000);
    });

    it('calls onRefreshNeeded when the scheduled timeout fires', async () => {
      document.cookie = `discord_proxy_token=${createValidToken(600)}`;

      monitor.enable(mockOnRefreshNeeded);
      await jest.runOnlyPendingTimersAsync();

      expect(mockOnRefreshNeeded).toHaveBeenCalled();
    });

    it('reschedules from the new token when expires_at advances after the callback', async () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      document.cookie = `discord_proxy_token=${createValidToken(600)}`;

      mockOnRefreshNeeded.mockImplementation(() => {
        document.cookie = `discord_proxy_token=${createValidToken(3600)}`;
        return Promise.resolve();
      });

      monitor.enable(mockOnRefreshNeeded);
      setTimeoutSpy.mockClear();
      await jest.runOnlyPendingTimersAsync();

      // After successful refresh, the next setTimeout uses the new token's expiry: 45 minutes
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 45 * 60 * 1000);
    });

    it('retries in 5 minutes when the cookie did not advance', async () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      document.cookie = `discord_proxy_token=${createValidToken(600)}`;

      // Callback does nothing -> cookie unchanged
      monitor.enable(mockOnRefreshNeeded);
      setTimeoutSpy.mockClear();
      await jest.runOnlyPendingTimersAsync();

      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5 * 60 * 1000);
    });

    it('does not reschedule after disable() during an in-flight callback', async () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      document.cookie = `discord_proxy_token=${createValidToken(600)}`;

      mockOnRefreshNeeded.mockImplementation(() => {
        monitor.disable();
        document.cookie = `discord_proxy_token=${createValidToken(3600)}`;
        return Promise.resolve();
      });

      monitor.enable(mockOnRefreshNeeded);
      setTimeoutSpy.mockClear();
      await jest.runOnlyPendingTimersAsync();

      expect(setTimeoutSpy).not.toHaveBeenCalled();
    });
  });
});
