/**
 * @jest-environment jsdom
 */
import {patchUrlMappings} from '../patchUrlMappings';

const MAPPINGS = [{prefix: '/api', target: 'example.com'}];

describe('patchUrlMappings', () => {
  describe('XMLHttpRequest', () => {
    const originalOpen = XMLHttpRequest.prototype.open;
    let openSpy: jest.SpyInstance;

    beforeEach(() => {
      // Spy first, so the patch wraps the spy and we can see what reaches the native `open`
      openSpy = jest.spyOn(XMLHttpRequest.prototype, 'open');
      patchUrlMappings(MAPPINGS, {patchFetch: false, patchWebSocket: false});
    });

    afterEach(() => {
      XMLHttpRequest.prototype.open = originalOpen;
    });

    it('remaps the url', () => {
      new XMLHttpRequest().open('GET', 'https://example.com/foo');
      expect(openSpy.mock.calls[0][1].toString()).toEqual('https://localhost/api/foo');
    });

    it('does not add arguments the caller did not pass', () => {
      new XMLHttpRequest().open('GET', 'https://example.com/foo');
      expect(openSpy.mock.calls[0]).toHaveLength(2);
    });

    it('keeps a request opened without an async argument asynchronous', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://example.com/foo');
      // Setting a response type throws for synchronous requests made from a document
      expect(() => {
        xhr.responseType = 'arraybuffer';
      }).not.toThrow();
    });

    it('forwards async, username and password when they are passed', () => {
      new XMLHttpRequest().open('GET', 'https://example.com/foo', true, 'user', 'pass');
      expect(openSpy.mock.calls[0].slice(2)).toEqual([true, 'user', 'pass']);

      new XMLHttpRequest().open('GET', 'https://example.com/foo', false);
      expect(openSpy.mock.calls[1].slice(2)).toEqual([false]);
    });
  });
});
