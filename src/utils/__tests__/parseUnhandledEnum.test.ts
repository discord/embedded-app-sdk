import {zodCoerceUnhandledValue} from '../zodUtils';

const TestObject = {
  UNHANDLED: -1,
  FOO: 'BAR',
} as const;

describe('zodCoerceUnhandledValue', () => {
  it('will set an unhandled value to UNHANDLED: -1', () => {
    const parser = zodCoerceUnhandledValue(TestObject);
    // This represents the case where a new enum is added to the discord client
    expect(parser.parse(2)).toEqual(TestObject.UNHANDLED);
  });
  it('will pass through a valid object value', () => {
    const parser = zodCoerceUnhandledValue(TestObject);
    expect(parser.parse(TestObject.FOO)).toEqual(TestObject.FOO);
  });
  it('will pass through a valid string value', () => {
    const parser = zodCoerceUnhandledValue(TestObject);
    expect(parser.parse('BAR')).toEqual(TestObject.FOO);
  });
  it('will throw if null is passed', () => {
    const parser = zodCoerceUnhandledValue(TestObject);
    expect(() => {
      parser.parse(null);
    }).toThrow();
  });
  it('will not throw if set to nullish and null is passed', () => {
    const parser = zodCoerceUnhandledValue(TestObject).nullish();
    expect(() => {
      parser.parse(null);
    }).not.toThrow();
  });
  it('will throw if no value is passed', () => {
    const parser = zodCoerceUnhandledValue(TestObject);
    expect(() => {
      parser.parse(undefined);
    }).toThrow();
  });
});

describe('zodCoerceUnhandledValue optional', () => {
  it('will set an unhandled enum to UNHANDLED: -1', () => {
    const parser = zodCoerceUnhandledValue(TestObject).optional();
    // This represents the case where a new enum is added to the discord client
    expect(parser.parse(2)).toEqual(TestObject.UNHANDLED);
  });
  it('will pass through a valid enum', () => {
    const parser = zodCoerceUnhandledValue(TestObject).optional();
    expect(parser.parse('BAR')).toEqual(TestObject.FOO);
  });
  it('will throw if null is passed', () => {
    const parser = zodCoerceUnhandledValue(TestObject).optional();
    expect(() => {
      parser.parse(null);
    }).toThrow();
  });
  // Aka the "optional" case
  it('will pass through an undefined enum', () => {
    const parser = zodCoerceUnhandledValue(TestObject).optional();
    expect(parser.parse(undefined)).toEqual(undefined);
  });
});
