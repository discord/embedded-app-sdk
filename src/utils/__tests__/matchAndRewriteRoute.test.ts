import {matchAndRewriteURL, MatchAndRewriteURLInputs} from '../url';
import {attemptRemap} from '../patchUrlMappings';

describe('matchAndRewriteURL', () => {
  describe('will rewrite urls correctly', () => {
    it('matches base path and doesnt mangle rest of path', () => {
      const TEST_CASES: Array<MatchAndRewriteURLInputs & {result: string}> = [
        {
          originalURL: new URL('https://discord.com'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/',
        },
        {
          originalURL: new URL('https://discord.com/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/test/?foo=bar',
        },
        {
          originalURL: new URL('https://discord.com/test?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/test?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/test/?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/test?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/test?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/foo/bar/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com/foo/bar',
          result: 'wss://123456789012345678.discordsays.com/?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/foo/bar/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com/foo/bar',
          result: 'wss://123456789012345678.discordsays.com/test/?foo=bar',
        },
      ];
      for (const {result, ...rest} of TEST_CASES) {
        const resultURL = matchAndRewriteURL(rest);
        expect(resultURL?.toString()).toEqual(result);
      }
    });

    it('matches non-base paths and doesnt mangle rest of path', () => {
      const TEST_CASES: Array<MatchAndRewriteURLInputs & {result: string}> = [
        {
          originalURL: new URL('https://discord.com'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/discord/',
        },
        {
          originalURL: new URL('https://discord.com/test?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/discord/test?foo=bar',
        },
        {
          originalURL: new URL('https://discord.com/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/discord/test/?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/test?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/discord/test?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/discord/test/?foo=bar',
        },
        {
          originalURL: new URL('wss://test-hyphen.discord.com/baz/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com/baz',
          result: 'wss://123456789012345678.discordsays.com/foo/test-hyphen/?foo=bar',
        },
        {
          originalURL: new URL('wss://test-hyphen.discord.com/baz/bar/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com/baz',
          result: 'wss://123456789012345678.discordsays.com/foo/test-hyphen/bar/?foo=bar',
        },
      ];
      for (const {result, ...rest} of TEST_CASES) {
        const resultURL = matchAndRewriteURL(rest);
        expect(resultURL?.toString()).toEqual(result);
      }
    });

    it('matches parameterized paths, rewriting parameters to host and doesnt mangle rest of path', () => {
      const TEST_CASES: Array<MatchAndRewriteURLInputs & {result: string}> = [
        {
          originalURL: new URL('https://test.discord.com/'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com',
          result: 'https://123456789012345678.discordsays.com/foo/test/',
        },
        {
          originalURL: new URL('https://test.discord.com/bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com',
          result: 'https://123456789012345678.discordsays.com/foo/test/bar',
        },
        {
          originalURL: new URL('https://test1-hyphen.discord.com/test2-hyphen/'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com',
          result: 'https://123456789012345678.discordsays.com/foo/test1-hyphen/test2-hyphen/',
        },
      ];

      for (const {result, ...rest} of TEST_CASES) {
        const resultURL = matchAndRewriteURL(rest);
        expect(resultURL?.toString()).toEqual(result);
      }
    });

    it('doesnt match a target if the target is only a substring', () => {
      const originalURL = new URL('https://example.com/foobar');

      const resultURL = matchAndRewriteURL({
        originalURL,
        prefixHost: '123.foo.com',
        prefix: '/foo',
        target: 'example.co',
      });

      expect(resultURL).toBe(originalURL);
    });

    it("Doesn't matter what order url mappings are in", () => {
      const url1 = attemptRemap({
        url: new URL('https://foo.googleapis.com/v1/test:url?key=abc123'),
        mappings: [
          {prefix: '/url1/test-url', target: 'test-url.testing.com'},
          {prefix: '/googleapis/{server}', target: '{server}.googleapis.com'},
        ],
      });
      expect(url1.toString()).toEqual('https://localhost/googleapis/foo/v1/test:url?key=abc123');

      const url2 = attemptRemap({
        url: new URL('https://foo.googleapis.com/v1/test:url/?key=abc123'),
        mappings: [
          {prefix: '/url1/test-url', target: 'test-url.testing.com'},
          {prefix: '/googleapis/{server}', target: '{server}.googleapis.com'},
        ],
      });
      expect(url2.toString()).toEqual('https://localhost/googleapis/foo/v1/test:url/?key=abc123');

      // Same as the earlier assertions with url mapping order swapped
      const url3 = attemptRemap({
        url: new URL('https://foo.googleapis.com/v1/test:url/?key=abc123'),
        mappings: [
          {prefix: '/googleapis/{server}', target: '{server}.googleapis.com'},
          {prefix: '/url1/test-url', target: 'test-url.testing.com'},
        ],
      });
      expect(url3.toString()).toEqual('https://localhost/googleapis/foo/v1/test:url/?key=abc123');

      const url4 = attemptRemap({
        url: new URL('https://foo.googleapis.com/v1/test:url?key=abc123'),
        mappings: [
          {prefix: '/googleapis/{server}', target: '{server}.googleapis.com'},
          {prefix: '/url1/test-url', target: 'test-url.testing.com'},
        ],
      });
      expect(url4.toString()).toEqual('https://localhost/googleapis/foo/v1/test:url?key=abc123');
    });

    it("Doesn't apply trailing slash to complete filenames", () => {
      const prefixHost = '123456789012345678.discordsays.com';
      const target = 'domain.com';
      const TEST_CASES: Array<MatchAndRewriteURLInputs & {result: string}> = [
        {
          originalURL: new URL('https://domain.com/file/music.mp3'),
          prefixHost,
          prefix: '/',
          target,
          result: 'https://123456789012345678.discordsays.com/file/music.mp3',
        },
        {
          originalURL: new URL('https://domain.com/file/text.txt'),
          prefixHost,
          prefix: '/',
          target,
          result: 'https://123456789012345678.discordsays.com/file/text.txt',
        },
        {
          originalURL: new URL('https://domain.com/a.b/c.html'),
          prefixHost,
          prefix: '/path/to/files',
          target,
          result: 'https://123456789012345678.discordsays.com/path/to/files/a.b/c.html',
        },
        {
          originalURL: new URL('https://domain.com/file/scene.bundle'),
          prefixHost,
          prefix: '/',
          target,
          result: 'https://123456789012345678.discordsays.com/file/scene.bundle',
        },
      ];

      for (const {result, ...rest} of TEST_CASES) {
        const resultURL = matchAndRewriteURL(rest);
        expect(resultURL?.toString()).toEqual(result);
      }
    });
  });
});
