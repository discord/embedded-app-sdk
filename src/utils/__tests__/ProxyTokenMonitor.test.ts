/**
 * @jest-environment jsdom
 */
import {ProxyTokenMonitor, TokenData} from '../ProxyTokenMonitor';

describe('ProxyTokenMonitor', () => {
  let monitor: ProxyTokenMonitor;
  let mockOnRefreshNeeded: jest.Mock;

  beforeEach(() => {
    monitor = new ProxyTokenMonitor();
    mockOnRefreshNeeded = jest.fn().mockResolvedValue(true);
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

  const createValidToken = (expiresIn: number = 3600): string => {
    const payload = {
      application_id: '12345',
      user_id: '67890',
      is_developer: false,
      created_at: Math.floor(Date.now() / 1000),
      expires_at: Math.floor(Date.now() / 1000) + expiresIn,
    };

    const header = btoa(JSON.stringify({alg: 'HS256', typ: 'JWT'}));
    const payloadB64 = btoa(JSON.stringify(payload));
    const signature = 'mock-signature';

    return `${header}.${payloadB64}.${signature}`;
  };

  describe('token parsing', () => {
    it('should parse a valid JWT token from cookies', () => {
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

    it('should return null when no token cookie exists', () => {
      document.cookie = 'other_cookie=value';

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      const tokenData = parseTokenCookie();

      expect(tokenData).toBeNull();
    });

    it('should return null for malformed token', () => {
      document.cookie = 'discord_proxy_token=invalid-token';

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      const tokenData = parseTokenCookie();

      expect(tokenData).toBeNull();
    });

    it('should handle token with missing payload', () => {
      document.cookie = 'discord_proxy_token=header..signature';

      const parseTokenCookie = (monitor as any).parseTokenCookie.bind(monitor);
      const tokenData = parseTokenCookie();

      expect(tokenData).toBeNull();
    });
  });

  describe('time calculation', () => {
    it('should calculate immediate refresh for expiring token', () => {
      const tokenData: TokenData = {
        application_id: '12345',
        user_id: '67890',
        is_developer: false,
        created_at: Math.floor(Date.now() / 1000),
        expires_at: Math.floor(Date.now() / 1000) + 600, // 10 minutes
      };

      const calculateTimeUntilRefresh = (monitor as any).calculateTimeUntilRefresh.bind(monitor);
      const msUntilRefresh = calculateTimeUntilRefresh(tokenData);

      expect(msUntilRefresh).toBe(0); // Should refresh immediately
    });

    it('should calculate correct delay for future refresh', () => {
      const tokenData: TokenData = {
        application_id: '12345',
        user_id: '67890',
        is_developer: false,
        created_at: Math.floor(Date.now() / 1000),
        expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour
      };

      const calculateTimeUntilRefresh = (monitor as any).calculateTimeUntilRefresh.bind(monitor);
      const msUntilRefresh = calculateTimeUntilRefresh(tokenData);

      // Should be 45 minutes (3600 - 900 seconds = 2700 seconds = 45 minutes)
      expect(msUntilRefresh).toBe(45 * 60 * 1000);
    });
  });

  describe('monitoring lifecycle', () => {
    it('should enable monitoring and schedule timeout', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      const token = createValidToken(3600); // 1 hour
      document.cookie = `discord_proxy_token=${token}`;

      monitor.enable(mockOnRefreshNeeded);

      expect(setTimeoutSpy).toHaveBeenCalled();
    });

    it('should disable monitoring and clear timeout', () => {
      const clearTimeoutSpy = jest.spyOn(window, 'clearTimeout');
      const token = createValidToken(3600); // 1 hour
      document.cookie = `discord_proxy_token=${token}`;

      monitor.enable(mockOnRefreshNeeded);
      monitor.disable();

      expect(clearTimeoutSpy).toHaveBeenCalled();
    });

    it('should not enable monitoring twice', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      const token = createValidToken(3600); // 1 hour
      document.cookie = `discord_proxy_token=${token}`;

      monitor.enable(mockOnRefreshNeeded);
      monitor.enable(mockOnRefreshNeeded);

      expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
    });

    it('should trigger refresh immediately when token needs refreshing', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      const token = createValidToken(600); // 10 minutes (needs refresh)
      document.cookie = `discord_proxy_token=${token}`;

      monitor.enable(mockOnRefreshNeeded);

      // Should schedule with 0 delay (immediate)
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);
    });

    it('should schedule refresh at correct time for future expiry', () => {
      const setTimeoutSpy = jest.spyOn(window, 'setTimeout');
      const token = createValidToken(3600); // 1 hour
      document.cookie = `discord_proxy_token=${token}`;

      monitor.enable(mockOnRefreshNeeded);

      // Should schedule for 45 minutes from now (60 - 15 minutes before expiry)
      const expectedMs = 45 * 60 * 1000;
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), expectedMs);
    });

    it('should call onRefreshNeeded when timeout fires', () => {
      const token = createValidToken(600); // 10 minutes (needs refresh)
      document.cookie = `discord_proxy_token=${token}`;

      monitor.enable(mockOnRefreshNeeded);

      // Trigger the timeout
      jest.runOnlyPendingTimers();

      expect(mockOnRefreshNeeded).toHaveBeenCalled();
    });
  });
});
