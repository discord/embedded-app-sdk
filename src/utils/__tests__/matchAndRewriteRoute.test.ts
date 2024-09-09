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
          result: 'https://123456789012345678.discordsays.com/.proxy/',
        },
        {
          originalURL: new URL('https://discord.com/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/.proxy/test/?foo=bar',
        },
        {
          originalURL: new URL('https://discord.com/test?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/.proxy/test?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/.proxy/test/?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/test?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/.proxy/test?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/foo/bar/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com/foo/bar',
          result: 'wss://123456789012345678.discordsays.com/.proxy/?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/foo/bar/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com/foo/bar',
          result: 'wss://123456789012345678.discordsays.com/.proxy/test/?foo=bar',
        },
      ];
      for (const {result, ...rest} of TEST_CASES) {
        const resultURL = matchAndRewriteURL(rest);
        expect(resultURL?.toString()).toEqual(result);
      }
    });

    it('matches base even if remapped twice', () => {
      const TEST_CASES: Array<MatchAndRewriteURLInputs & {result: string}> = [
        {
          originalURL: new URL('https://discord.com'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/.proxy/',
        },
        {
          originalURL: new URL('wss://discord.com'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/.proxy/',
        },
      ];
      for (const {result, ...rest} of TEST_CASES) {
        const resultURL = matchAndRewriteURL(rest);
        if (!(resultURL instanceof URL)) {
          throw new Error('URL expected');
        }
        const result2URL = matchAndRewriteURL({
          ...rest,
          originalURL: resultURL,
        });
        expect(result2URL?.toString()).toEqual(result);
      }
    });

    it('matches non-base paths and doesnt mangle rest of path', () => {
      const TEST_CASES: Array<MatchAndRewriteURLInputs & {result: string}> = [
        {
          originalURL: new URL('https://discord.com'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/.proxy/discord/',
        },
        {
          originalURL: new URL('https://discord.com/test?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/.proxy/discord/test?foo=bar',
        },
        {
          originalURL: new URL('https://discord.com/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'https://123456789012345678.discordsays.com/.proxy/discord/test/?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/test?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/.proxy/discord/test?foo=bar',
        },
        {
          originalURL: new URL('wss://discord.com/test/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/discord',
          target: 'discord.com',
          result: 'wss://123456789012345678.discordsays.com/.proxy/discord/test/?foo=bar',
        },
        {
          originalURL: new URL('wss://test-hyphen.discord.com/baz/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com/baz',
          result: 'wss://123456789012345678.discordsays.com/.proxy/foo/test-hyphen/?foo=bar',
        },
        {
          originalURL: new URL('wss://test-hyphen.discord.com/baz/bar/?foo=bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com/baz',
          result: 'wss://123456789012345678.discordsays.com/.proxy/foo/test-hyphen/bar/?foo=bar',
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
          result: 'https://123456789012345678.discordsays.com/.proxy/foo/test/',
        },
        {
          originalURL: new URL('https://test.discord.com/bar'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com',
          result: 'https://123456789012345678.discordsays.com/.proxy/foo/test/bar',
        },
        {
          originalURL: new URL('https://test1-hyphen.discord.com/test2-hyphen/'),
          prefixHost: '123456789012345678.discordsays.com',
          prefix: '/foo/{parameter}',
          target: '{parameter}.discord.com',
          result: 'https://123456789012345678.discordsays.com/.proxy/foo/test1-hyphen/test2-hyphen/',
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

    it('Applies the /.proxy/ mapping without any mappings', () => {
      const url = attemptRemap({
        url: new URL('https://1234567890.discordsays.com/api/token'),
        mappings: [],
      });
      expect(url.toString()).toEqual('https://1234567890.discordsays.com/.proxy/api/token');

      const base = attemptRemap({
        url: new URL('https://1234567890.discordsays.com/'),
        mappings: [],
      });
      expect(base.toString()).toEqual('https://1234567890.discordsays.com/.proxy/');
    });

    it("Doesn't apply /.proxy/ if it already prepends the path", () => {
      const noPrepend = attemptRemap({
        url: new URL('https://1234567890.discordsays.com/.proxy/api/token'),
        mappings: [],
      });
      expect(noPrepend.toString()).toEqual('https://1234567890.discordsays.com/.proxy/api/token');

      const prepend = attemptRemap({
        url: new URL('https://1234567890.discordsays.com/path/before/.proxy/api/token'),
        mappings: [],
      });
      expect(prepend.toString()).toEqual('https://1234567890.discordsays.com/.proxy/path/before/.proxy/api/token');
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
          result: 'https://123456789012345678.discordsays.com/.proxy/file/music.mp3',
        },
        {
          originalURL: new URL('https://domain.com/file/text.txt'),
          prefixHost,
          prefix: '/',
          target,
          result: 'https://123456789012345678.discordsays.com/.proxy/file/text.txt',
        },
        {
          originalURL: new URL('https://domain.com/a.b/c.html'),
          prefixHost,
          prefix: '/path/to/files',
          target,
          result: 'https://123456789012345678.discordsays.com/.proxy/path/to/files/a.b/c.html',
        },
        {
          originalURL: new URL('https://domain.com/file/scene.bundle'),
          prefixHost,
          prefix: '/',
          target,
          result: 'https://123456789012345678.discordsays.com/.proxy/file/scene.bundle',
        },
      ];

      for (const {result, ...rest} of TEST_CASES) {
        const resultURL = matchAndRewriteURL(rest);
        expect(resultURL?.toString()).toEqual(result);
      }
    });
  });
});
