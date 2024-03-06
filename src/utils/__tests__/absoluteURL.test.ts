/**
 * @jest-environment jsdom
 */
import {absoluteURL} from '../url';

describe('absoluteURL', () => {
  it('does not change absolute URLS', () => {
    const TEST_CASES: Array<{url: string; expected: string}> = [
      {
        url: 'https://google.com/flights/to/italy',
        expected: 'https://google.com/flights/to/italy',
      },
      {
        url: 'https://test.case.com/foo/bar?test=true&pass=maybe',
        expected: 'https://test.case.com/foo/bar?test=true&pass=maybe',
      },
      {
        url: 'wss://web.socket.co.uk/a/b/c?stil_testing=true',
        expected: 'wss://web.socket.co.uk/a/b/c?stil_testing=true',
      },
    ];
    for (const {url, expected} of TEST_CASES) {
      const result = absoluteURL(url);
      expect(result.toString()).toEqual(expected);
    }
  });
  it('makes relative URLs absolute', () => {
    const TEST_CASES: Array<{url: string; host?: string; protocol?: string; expected: string}> = [
      {
        url: '/flights/to/italy',
        protocol: 'https:',
        host: 'google.com',
        expected: 'https://google.com/flights/to/italy',
      },
      {
        url: '/foo/bar?test=true&pass=maybe',
        protocol: 'https:',
        host: 'test.case.com',
        expected: 'https://test.case.com/foo/bar?test=true&pass=maybe',
      },
      {
        url: '/a/b/c?stil_testing=true',
        protocol: 'wss:',
        host: 'web.socket.co.uk',
        expected: 'wss://web.socket.co.uk/a/b/c?stil_testing=true',
      },
      {
        url: '/relative/path/to/something',
        expected: `${window.location.protocol}//${window.location.host}/relative/path/to/something`,
      },
      {
        url: 'foo/the/bar',
        expected: `${window.location.protocol}//${window.location.host}/foo/the/bar`,
      },
    ];
    for (const {url, protocol, host, expected} of TEST_CASES) {
      const result = absoluteURL(url, protocol, host);
      expect(result.toString()).toEqual(expected);
    }
  });
});
