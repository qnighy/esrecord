/**
 * A dummy value to use as a brand for the {@link ESRecord} type.
 */
export declare const esRecordBrand: unique symbol;

/**
 * A replacement type for the future primitive Record type,
 * which will presumably be written as `#{ key: value }`.
 */
export type ESRecord<T> = Readonly<T> & { [esRecordBrand]: "ESRecord" };
export type AnyESRecord = ESRecord<Record<string, unknown>>;

/**
 * A dummy value to use as a brand for the {@link ESTuple} type.
 */
export declare const esTupleBrand: unique symbol;

/**
 * A replacement type for the future primitive Tuple type,
 * which will presumably be written as `#[value, value]`.
 */
export type ESTuple<T> = Readonly<T> & { [esTupleBrand]: "ESTuple" };
export type AnyESTuple = ESTuple<readonly unknown[]>;
