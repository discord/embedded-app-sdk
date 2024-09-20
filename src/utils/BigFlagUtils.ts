/**
 * Context: Due to Discord supporting more than 32 permissions, permission calculation has become more complicated than naive
 * bit operations on `number`s. To support this generically, we have created BigFlagUtils to work with bit-flags greater
 * than 32-bits in size.
 *
 * Ideally, we would like to use BigInt, which is pretty efficient, but some JavaScript engines do not support it.
 *
 * This file is intended to be a set of lower-level operators that act directly on "BigFlags".
 *
 * If you're working with permissions, in most cases you can probably use PermissionUtils.
 */

import bigInt from 'big-integer';

const MAX_BIG_INT = 64;
const SMALL_INT = 16;
const PARTS = MAX_BIG_INT / SMALL_INT;

function checkBrowserSupportsBigInt(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    BigInt;
    return true;
  } catch {
    return false;
  }
}

/**
 * Takes the sliced output of `toHexReverseArray` and converts hex to decimal.
 */
function fromHexReverseArray(hexValues: number[], start: number, size: number): number {
  let value = 0;
  for (let i = 0; i < size; i++) {
    const byte = hexValues[start + i];
    if (byte === undefined) {
      break;
    }
    value += byte * 16 ** i;
  }
  return value;
}

/**
 * Converts a number string to array of hex bytes based on the implementation found at
 * https://stackoverflow.com/questions/18626844/convert-a-large-integer-to-a-hex-string-in-javascript
 *
 * To avoid extra allocations it returns the values in reverse.
 */
function toHexReverseArray(value: string): number[] {
  const sum: number[] = [];
  for (let i = 0; i < value.length; i++) {
    let s = Number(value[i]);
    for (let j = 0; s || j < sum.length; j++) {
      s += (sum[j] || 0) * 10;
      sum[j] = s % 16;
      s = (s - sum[j]) / 16;
    }
  }
  return sum;
}

/**
 * Splits a big integers into array of small integers to perform fast bitwise operations.
 */
function splitBigInt(value: string): number[] {
  const sum = toHexReverseArray(value);
  const parts = Array(PARTS);
  for (let i = 0; i < PARTS; i++) {
    // Highest bits to lowest bits.
    parts[PARTS - 1 - i] = fromHexReverseArray(sum, i * PARTS, PARTS);
  }
  return parts;
}

class HighLow {
  parts: number[];
  str: string | undefined;

  static fromString(value: string): HighLow {
    return new HighLow(splitBigInt(value), value);
  }

  static fromBit(index: number): HighLow {
    const parts = Array(PARTS);
    const offset = Math.floor(index / SMALL_INT);
    for (let i = 0; i < PARTS; i++) {
      // Highest bits to lowest bits.
      parts[PARTS - 1 - i] = i === offset ? 1 << (index - offset * SMALL_INT) : 0;
    }
    return new HighLow(parts);
  }

  constructor(parts: number[], str?: string) {
    this.parts = parts;
    this.str = str;
  }

  and({parts}: HighLow): HighLow {
    return new HighLow(this.parts.map((v, i) => v & parts[i]));
  }

  or({parts}: HighLow): HighLow {
    return new HighLow(this.parts.map((v, i) => v | parts[i]));
  }

  xor({parts}: HighLow): HighLow {
    return new HighLow(this.parts.map((v, i) => v ^ parts[i]));
  }

  not(): HighLow {
    return new HighLow(this.parts.map((v) => ~v));
  }

  equals({parts}: HighLow): boolean {
    return this.parts.every((v, i) => v === parts[i]);
  }

  /**
   * For the average case the string representation is provided, but
   * when we need to convert high and low to string we just let the
   * slower big-integer library do it.
   */
  toString() {
    if (this.str != null) {
      return this.str;
    }
    const array = new Array(MAX_BIG_INT / 4);
    this.parts.forEach((value, offset) => {
      const hex = toHexReverseArray(value.toString());
      for (let i = 0; i < 4; i++) {
        array[i + offset * 4] = hex[4 - 1 - i] || 0;
      }
    });
    return (this.str = bigInt.fromArray(array, 16).toString());
  }

  toJSON() {
    return this.toString();
  }
}
const SUPPORTS_BIGINT = checkBrowserSupportsBigInt();

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

// Polyfill toJSON on BigInt if necessary.
if (SUPPORTS_BIGINT && BigInt.prototype.toJSON == null) {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}

/**
 * Technically, it should be one or the other, but Typescript doesn't seem
 * to have the power to express that dynamically yet.
 */
export type BigFlag = bigint | HighLow;

export const isBigFlag: (value: any) => value is BigFlag = SUPPORTS_BIGINT
  ? function (value: any): value is bigint {
      return typeof value === 'bigint';
    }
  : function (value: any): value is HighLow {
      return value instanceof HighLow;
    };

const HIGH_LOW_CACHE: Record<string, HighLow> = {};

const convertToBigFlag: (value: number | string | BigFlag) => BigFlag = SUPPORTS_BIGINT
  ? function convertToBigFlagBigInt(value) {
      return BigInt(value as number | string | bigint);
    }
  : function convertToBigFlagHighLow(value) {
      if (value instanceof HighLow) {
        return value;
      }

      if (typeof value === 'number') {
        value = value.toString();
      }

      // These type assertions are ugly, but there doesn't seem to be a
      // runtime costless way to do a type assertion above.
      if (HIGH_LOW_CACHE[value as string] != null) {
        return HIGH_LOW_CACHE[value as string];
      }

      HIGH_LOW_CACHE[value as string] = HighLow.fromString(value as string);

      return HIGH_LOW_CACHE[value as string];
    };

const EMPTY_FLAG = convertToBigFlag(0);

const flagAnd: (first: BigFlag, second: BigFlag) => BigFlag = SUPPORTS_BIGINT
  ? function flagAndBigInt(first = EMPTY_FLAG, second = EMPTY_FLAG) {
      return (first as bigint) & (second as bigint);
    }
  : function flagAndHighLow(first = EMPTY_FLAG, second = EMPTY_FLAG) {
      return (first as HighLow).and(second as HighLow);
    };

const flagOr: (first: BigFlag, second: BigFlag) => BigFlag = SUPPORTS_BIGINT
  ? function flagOrBigInt(first = EMPTY_FLAG, second = EMPTY_FLAG) {
      return (first as bigint) | (second as bigint);
    }
  : function flagOrHighLow(first = EMPTY_FLAG, second = EMPTY_FLAG) {
      return (first as HighLow).or(second as HighLow);
    };

const flagXor: (first: BigFlag, second: BigFlag) => BigFlag = SUPPORTS_BIGINT
  ? function flagXorBigInt(first = EMPTY_FLAG, second = EMPTY_FLAG) {
      return (first as bigint) ^ (second as bigint);
    }
  : function flagXorHighLow(first = EMPTY_FLAG, second = EMPTY_FLAG) {
      return (first as HighLow).xor(second as HighLow);
    };

const flagNot: (first: BigFlag | undefined) => BigFlag = SUPPORTS_BIGINT
  ? function flagNotBigInt(first = EMPTY_FLAG) {
      return ~(first as bigint);
    }
  : function flagNotHighLow(first = EMPTY_FLAG) {
      return (first as HighLow).not();
    };

const flagEquals: (first: BigFlag | undefined, second: BigFlag | undefined) => boolean = SUPPORTS_BIGINT
  ? function flagEqualsBigInt(first, second) {
      return first === second;
    }
  : function flagEqualsHighLow(first, second) {
      if (first == null || second == null) {
        // eslint-disable-next-line eqeqeq
        return first == second;
      }
      return (first as HighLow).equals(second as HighLow);
    };

function flagOrMultiple(...flags: BigFlag[]): BigFlag {
  let result = flags[0];
  for (let i = 1; i < flags.length; i++) {
    result = flagOr(result, flags[i]);
  }
  return result;
}

function flagHas(base: BigFlag, flag: BigFlag): boolean {
  return flagEquals(flagAnd(base, flag), flag);
}

function flagHasAny(base: BigFlag, flag: BigFlag): boolean {
  return !flagEquals(flagAnd(base, flag), EMPTY_FLAG);
}

function flagAdd(base: BigFlag, flag: BigFlag): BigFlag {
  return flag === EMPTY_FLAG ? base : flagOr(base, flag);
}

function flagRemove(base: BigFlag, flag: BigFlag): BigFlag {
  return flag === EMPTY_FLAG ? base : flagXor(base, flagAnd(base, flag));
}

const getFlag: (index: number) => BigFlag = SUPPORTS_BIGINT
  ? function getFlagBigInt(index) {
      return BigInt(1) << BigInt(index);
    }
  : function getFlagHighLow(index) {
      return HighLow.fromBit(index);
    };

export default {
  combine: flagOrMultiple,
  add: flagAdd,
  remove: flagRemove,
  filter: flagAnd,
  invert: flagNot,

  has: flagHas,
  hasAny: flagHasAny,
  equals: flagEquals,

  deserialize: convertToBigFlag,
  getFlag: getFlag,
};
