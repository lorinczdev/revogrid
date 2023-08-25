/*!
 * Built by Revolist
 */
import reduce from "lodash/reduce";
import { debounce } from "lodash";
import { columnTypes, rowTypes } from "../store/storeTypes";
import DimensionStore from "../store/dimension/dimension.store";
import { getItemByIndex } from "../store/dimension/dimension.helpers";
import { gatherTrimmedItems } from "../store/dataSource/trimmed.plugin";
import { RESIZE_INTERVAL } from "../utils/consts";
/**
 * Dimension provider
 * Stores dimension information and custom sizes
 */
export default class DimensionProvider {
  constructor(viewports, config) {
    this.viewports = viewports;
    const sizeChanged = debounce((k) => config.realSizeChanged(k), RESIZE_INTERVAL);
    this.stores = reduce([...rowTypes, ...columnTypes], (sources, k) => {
      sources[k] = new DimensionStore();
      sources[k].store.onChange('realSize', () => sizeChanged(k));
      return sources;
    }, {});
  }
  /**
   * Clear old sizes from dimension and viewports
   * @param type - dimension type
   * @param count - count of items
   */
  clearSize(t, count) {
    this.stores[t].drop();
    // after we done with drop trigger viewport recalculaction
    this.viewports.stores[t].setOriginalSizes(this.stores[t].store.get('originItemSize'));
    this.setItemCount(count, t);
  }
  /**
   * Apply new custom sizes to dimension and view port
   * @param type - dimension type
   * @param sizes - new custom sizes
   * @param keepOld - keep old sizes merge new with old
   */
  setCustomSizes(type, sizes, keepOld = false) {
    let newSizes = sizes;
    if (keepOld) {
      const oldSizes = this.stores[type].store.get('sizes');
      newSizes = Object.assign(Object.assign({}, oldSizes), sizes);
    }
    this.stores[type].setDimensionSize(newSizes);
    this.viewports.stores[type].setViewPortDimensionSizes(newSizes, !keepOld ? this.stores[type].store.get('originItemSize') : undefined);
  }
  setItemCount(realCount, type) {
    this.viewports.stores[type].setViewport({ realCount });
    this.stores[type].setStore({ count: realCount });
  }
  /**
   * Apply trimmed items
   * @param trimmed - trimmed items
   * @param type
   */
  setTrimmed(trimmed, type) {
    const allTrimmed = gatherTrimmedItems(trimmed);
    const dimStoreType = this.stores[type];
    dimStoreType.setStore({ trimmed: allTrimmed });
    this.viewports.stores[type].setViewPortDimensionSizes(dimStoreType.store.get('sizes'));
  }
  /**
   * Sets dimension data and view port coordinate
   * @param items - data/column items
   * @param type - dimension type
   */
  setData(itemCount, type, noVirtual = false) {
    this.setItemCount(itemCount, type);
    if (noVirtual) {
      this.setNoVirtual(type);
    }
    this.updateViewport(type);
  }
  /**
   * Virtualization will get disabled
   * @param type - dimension type
   */
  setNoVirtual(type) {
    const dimension = this.stores[type].getCurrentState();
    this.viewports.stores[type].setViewport({ virtualSize: dimension.realSize });
  }
  /**
   * Drop all dimension data
   */
  dropColumns(types = columnTypes) {
    for (let type of types) {
      this.stores[type].drop();
      this.viewports.stores[type].clearItems(); // check if needed
    }
  }
  getFullSize() {
    var _a, _b;
    let x = 0;
    let y = 0;
    for (let type of columnTypes) {
      x += ((_a = this.stores[type]) === null || _a === void 0 ? void 0 : _a.store.get('realSize')) || 0;
    }
    for (let type of rowTypes) {
      y += ((_b = this.stores[type]) === null || _b === void 0 ? void 0 : _b.store.get('realSize')) || 0;
    }
    return { y, x };
  }
  setNewColumns(type, newLength, sizes, noVirtual = false) {
    this.setItemCount(newLength, type);
    this.setCustomSizes(type, sizes);
    if (noVirtual) {
      this.setNoVirtual(type);
    }
    this.updateViewport(type);
  }
  updateViewport(type) {
    this.setViewPortCoordinate({
      coordinate: this.viewports.stores[type].lastCoordinate,
      type,
    });
  }
  setViewPortCoordinate({ coordinate, type }) {
    const dimension = this.stores[type].getCurrentState();
    this.viewports.stores[type].setViewPortCoordinate(coordinate, dimension);
  }
  getViewPortPos(e) {
    const dimension = this.stores[e.dimension].getCurrentState();
    const item = getItemByIndex(dimension, e.coordinate);
    return item.start;
  }
  setSettings(data, dimensionType) {
    let stores = [];
    switch (dimensionType) {
      case 'rgCol':
        stores = columnTypes;
        break;
      case 'rgRow':
        stores = rowTypes;
        break;
    }
    for (let s of stores) {
      this.stores[s].setStore(data);
    }
  }
}
//# sourceMappingURL=dimension.provider.js.map
