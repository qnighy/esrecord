/**
 * A dummy value to use as a brand for the {@link RecordObject} type.
 */
export declare const recordBrand: unique symbol;
/**
 * A dummy value to use as a brand for the {@link PrimitiveRecord} type.
 */
export declare const primitiveRecordBrand: unique symbol;
/**
 * A replacement type for the future `Record` wrapper type.
 */
export type RecordObject<T> = T & {
  [recordBrand]: "Record";
};
/**
 * A replacement type for the future primitive Record type,
 * which will presumably be written as `#{ key: value }`.
 */
export type PrimitiveRecord<T> = T & {
  [recordBrand]: "Record";
  [primitiveRecordBrand]: "PrimitiveRecord";
};

declare global {
  /**
   * The `Record` constructor.
   */
  var Record: RecordConstructor;

  /**
   * The type of the `Record` constructor.
   */
  interface RecordConstructor {
    /**
     * Creates a new primitive Record value from the given object.
     *
     * @param obj the object providing the key-value pairs for the Record.
     */
    <T>(obj: T): PrimitiveRecord<T>;

    /**
     * Creates a new primitive Record value from the given key-value pairs.
     * @param entries the key-value pairs to create the Record from.
     */
    fromEntries<K extends PropertyKey, V>(entries: Iterable<readonly [K, V]>): { [k in K]?: V; };

    /**
     * Checks if the given object is a Record wrapper object.
     * @param obj the object to test against.
     */
    [Symbol.hasInstance](obj: unknown): obj is RecordObject<any> & object;

    prototype: null;
  }
}
