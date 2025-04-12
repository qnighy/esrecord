const PRIMITIVE_TYPE_UNDEFINED = 1;
const PRIMITIVE_TYPE_NULL = 2;
const PRIMITIVE_TYPE_FALSE = 3;
const PRIMITIVE_TYPE_TRUE = 4;
const PRIMITIVE_TYPE_ZERO = 5;
const PRIMITIVE_TYPE_I32 = 6;
const PRIMITIVE_TYPE_F64 = 7;
const PRIMITIVE_TYPE_BIGNUM = 8;
const PRIMITIVE_TYPE_STRING = 9;
const PRIMITIVE_TYPE_OBJECT_OR_SYMBOL = 10;

export function randomInitialValue(): number {
  return Math.random() * 0xFFFFFFFF | 0;
}

export function tupleHashCode(values: readonly unknown[], prev: number): number {
  let current = prev;
  current = appendHash(values.length + 1, current);
  for (const value of values) {
    current = primitiveHashCode(value, current);
  }
  return current;
}

export function primitiveHashCode(value: unknown, prev: number): number {
  let current = prev;
  switch (typeof value) {
    case "undefined":
      current = appendHash(PRIMITIVE_TYPE_UNDEFINED, current);
      break;
    case "boolean":
      current = appendHash(value ? PRIMITIVE_TYPE_TRUE : PRIMITIVE_TYPE_FALSE, current);
      break;
    case "number":
      if (Object.is(value, 0)) {
        current = appendHash(PRIMITIVE_TYPE_ZERO, current);
      } else if (Object.is(value | 0, value)) {
        current = appendHash(PRIMITIVE_TYPE_I32, current);
        current = appendHash(value, current);
      } else if (isNaN(value)) {
        current = appendHash(PRIMITIVE_TYPE_F64, current);
        // Canonical NaN in little endian: 00 00 00 00 00 00 F8 7F
        current = appendHash(0x00000000, current);
        current = appendHash(0x7FF80000, current);
      } else {
        union64f64[0] = value;
        current = appendHash(PRIMITIVE_TYPE_F64, current);
        // Put to hash in little endian order
        current = appendHash(union64i32[0 ^ isBigEndian]!, current);
        current = appendHash(union64i32[1 ^ isBigEndian]!, current);
      }
      break;
    case "bigint": {
      current = appendHash(PRIMITIVE_TYPE_BIGNUM, current);
      const s = value.toString(16);
      const len = Math.ceil(s.length / 8);
      current = appendHash(len + 1, current);
      for (let i = 0; i < len; i++) {
        const part = s.slice(Math.max(s.length - (i + 1) * 8, 0), s.length - i * 8);
        current = appendHash(parseInt(part, 16), current);
      }
      break;
    }
    case "string":
      current = appendHash(PRIMITIVE_TYPE_STRING, current);
      current = appendHash(value.length + 1, current);
      for (let i = 0; i < value.length; i++) {
        current = appendHash(value.charCodeAt(i), current);
      }
      break;
    case "symbol":
    case "function":
    case "object": {
      if (value === null) {
        current = appendHash(PRIMITIVE_TYPE_NULL, current);
      } else {
        current = appendHash(PRIMITIVE_TYPE_OBJECT_OR_SYMBOL, current);
        const hash = getObjectHash(value);
        current = appendHash(hash, current);
      }
      break;
    }
    default: {
      throw new TypeError(`Unknown type: ${typeof value}`);
    }
  }
  return current;
}

const strongSymbolHashes: Map<object | symbol, number> = new Map();
const objectOrSymbolHashes: WeakMap<object | symbol, number> = new WeakMap();
let objectHashCounter = 1;
function getObjectHash(o: object | symbol): number {
  const memoized = strongSymbolHashes.get(o) ?? objectOrSymbolHashes.get(o);
  if (memoized != null) {
    return memoized;
  }
  const hash = objectHashCounter++;
  try {
    objectOrSymbolHashes.set(o, hash);
  } catch (e) {
    if (e instanceof TypeError) {
      strongSymbolHashes.set(o, hash);
    } else {
      throw e;
    }
  }
  return hash;
}

const union64 = new ArrayBuffer(8);
const union64f64 = new Float64Array(union64);
const union64i32 = new Int32Array(union64);
// Big    endian: 40 00 00 00 00 00 00 00
// Little endian: 00 00 00 00 00 00 00 40
union64f64[0] = 2.0;
const isBigEndian = union64i32[0]! > 0 ? 1 : 0;


function appendHash(value: number, prev: number): number {
  let current = prev;
  current ^= value;
  current = Math.imul(current, 16777619);
  return current;
}
