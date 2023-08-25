/*!
 * Built by Revolist
 */
/**
 * Storing pre-calculated
 * Dimension information and sizes
 */
import { createStore } from "@stencil/store";
import reduce from "lodash/reduce";
import { setStore } from "../../utils/store.utils";
import { calculateDimensionData } from "./dimension.helpers";
import each from "lodash/each";
const trimmedPlugin = (store) => {
  let trimmedSize = {};
  const setTrimmed = (sizes, trimmed) => {
    const newSize = Object.assign({}, sizes);
    trimmedSize = {};
    each(trimmed, (v, index) => {
      if (v && newSize[index]) {
        trimmedSize[index] = newSize[index];
        delete newSize[index];
      }
    });
    store.setDimensionSize(newSize);
  };
  return {
    set(key, val) {
      switch (key) {
        case 'trimmed':
          const trim = val;
          const sizes = store.store.get('sizes');
          // recover trimmed, apply new trim
          setTrimmed(Object.assign(Object.assign({}, sizes), trimmedSize), trim);
          break;
      }
    }
  };
};
const realSizePlugin = (store) => {
  return {
    set(k) {
      switch (k) {
        case 'count':
        case 'sizes':
        case 'originItemSize':
          let realSize = 0;
          const count = store.store.get('count');
          for (let i = 0; i < count; i++) {
            realSize += store.store.get('sizes')[i] || store.store.get('originItemSize');
          }
          store.setStore({ realSize });
      }
    }
  };
};
function initialBase() {
  return {
    indexes: [],
    count: 0,
    // plugin support
    trimmed: {},
    // size operations, this provider stores only changed sizes, not all of them
    // same as indexes but for sizes and positions
    // item index to size
    sizes: {},
    // order in indexes[] to coordinate
    positionIndexToItem: {},
    // initial element to coordinate ^
    indexToItem: {},
    positionIndexes: [],
  };
}
function initialState() {
  return Object.assign(Object.assign({}, initialBase()), {
    // size which all items can take
    realSize: 0,
    // initial item size if it wasn't changed
    originItemSize: 0
  });
}
export default class DimensionStore {
  constructor() {
    this.store = createStore(initialState());
    this.store.use(trimmedPlugin(this));
    this.store.use(realSizePlugin(this));
  }
  getCurrentState() {
    const state = initialState();
    const keys = Object.keys(state);
    return reduce(keys, (r, k) => {
      const data = this.store.get(k);
      r[k] = data;
      return r;
    }, state);
  }
  dispose() {
    setStore(this.store, initialState());
  }
  setStore(data) {
    setStore(this.store, data);
  }
  drop() {
    setStore(this.store, initialBase());
  }
  /**
   * Set custom dimension sizes and overwrite old
   * Generates new indexes based on sizes
   * @param sizes - sizes to set
   */
  setDimensionSize(sizes) {
    const dimensionData = calculateDimensionData(this.store.get('originItemSize'), sizes);
    setStore(this.store, dimensionData);
    return dimensionData;
  }
}
//# sourceMappingURL=dimension.store.js.map
