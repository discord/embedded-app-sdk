import * as z from 'zod';
import {fallbackToDefault} from '../zodUtils';

describe('fallbackToDefault', () => {
  const schema = fallbackToDefault(z.enum(['hi', 'hello', 'UNKNOWN']).default('UNKNOWN'));

  test.each([
    {in: 'hello', out: 'hello'},
    {in: 'hi', out: 'hi'},
    {in: 'UNKNOWN', out: 'UNKNOWN'},
    {in: undefined, out: 'UNKNOWN'},
    {in: null, out: 'UNKNOWN'},
    {in: 'bad', out: 'UNKNOWN'},
  ])('should fallback to default value', (t) => {
    expect(schema.safeParse(t.in)).toEqual({success: true, data: t.out});
    expect(schema.parse(t.in)).toEqual(t.out);
  });

  it('should allow pulling overlay schema', () => {
    const overlaySchema = schema.overlayType;

    // Ensure overlay schema doesn't have any default fallbacks
    expect(overlaySchema.safeParse('hi')).toEqual({success: true, data: 'hi'});
    expect(overlaySchema.safeParse('hello')).toEqual({success: true, data: 'hello'});
    expect(overlaySchema.safeParse('UNKNOWN')).toEqual({success: true, data: 'UNKNOWN'});
    expect(overlaySchema.safeParse(undefined)).toEqual({success: true, data: 'UNKNOWN'});
    expect(overlaySchema.safeParse(null)).toEqual(expect.objectContaining({success: false}));
    expect(overlaySchema.safeParse('bad')).toEqual(expect.objectContaining({success: false}));
  });
});
