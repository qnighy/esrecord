import { HashMap } from "./hash-map.ts";

export class Interner<K extends readonly unknown[], V extends WeakKey> {
  #map: HashMap<K, WeakRef<V>>;
  #finalizationRegistry: FinalizationRegistry<K>;

  constructor() {
    this.#map = new HashMap();
    this.#finalizationRegistry = new FinalizationRegistry<K>((key) => {
      this.#map.delete(key);
    });
  }

  intern(key: K, newValue: () => V): V {
    const existingValue = this.#map.get(key)?.deref();
    if (!existingValue) {
      const value = newValue();
      const weakValue = new WeakRef(value);
      this.#map.set(key, weakValue);
      this.#finalizationRegistry.register(value, key);
      return value;
    }
    return existingValue;
  }
}
