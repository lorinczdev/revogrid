/*!
 * Built by Revolist
 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index$1 = require('./index-5fcf71f2.js');
const index = require('./index-7bbf16f2.js');
const viewport_helpers = require('./viewport.helpers-8b3442d2.js');
const events = require('./events-f11593cf.js');
const filter_button = require('./filter.button-efd378ea.js');
const debounce = require('./debounce-85a83584.js');
const dispatcher = require('./dispatcher-b36895c3.js');

class ThemeCompact {
  constructor() {
    this.defaultRowSize = 32;
  }
}

class ThemeDefault {
  constructor() {
    this.defaultRowSize = 27;
  }
}

class ThemeMaterial {
  constructor() {
    this.defaultRowSize = 42;
  }
}

const DEFAULT_THEME = 'default';
const allowedThemes = [DEFAULT_THEME, 'material', 'compact', 'darkMaterial', 'darkCompact'];
class ThemeService {
  get theme() {
    return this.currentTheme;
  }
  get rowSize() {
    return this.customRowSize || this.currentTheme.defaultRowSize;
  }
  set rowSize(size) {
    this.customRowSize = size;
  }
  constructor(cfg) {
    this.customRowSize = 0;
    this.customRowSize = cfg.rowSize;
    this.register('default');
  }
  register(theme) {
    const parsedTheme = ThemeService.getTheme(theme);
    switch (parsedTheme) {
      case 'material':
      case 'darkMaterial':
        this.currentTheme = new ThemeMaterial();
        break;
      case 'compact':
      case 'darkCompact':
        this.currentTheme = new ThemeCompact();
        break;
      default:
        this.currentTheme = new ThemeDefault();
        break;
    }
  }
  static getTheme(theme) {
    if (allowedThemes.indexOf(theme) > -1) {
      return theme;
    }
    return DEFAULT_THEME;
  }
}

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!index.isArrayLike_1(collection)) {
      var iteratee = index._baseIteratee(predicate);
      collection = index.keys_1(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index$1 = findIndexFunc(collection, predicate, fromIndex);
    return index$1 > -1 ? iterable[iteratee ? collection[index$1] : index$1] : undefined;
  };
}

var _createFind = createFind;

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to inspect.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = _createFind(index.findIndex_1);

var find_1 = find;

const rowTypes = ['rowPinStart', 'rgRow', 'rowPinEnd'];
const columnTypes = ['colPinStart', 'rgCol', 'colPinEnd'];
function isRowType(type) {
  return rowTypes.indexOf(type) > -1;
}

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index$1 = -1,
      result = index.isArrayLike_1(collection) ? Array(collection.length) : [];

  index._baseEach(collection, function(value, key, collection) {
    result[++index$1] = iteratee(value, key, collection);
  });
  return result;
}

var _baseMap = baseMap;

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = index.isArray_1(collection) ? index._arrayMap : _baseMap;
  return func(collection, index._baseIteratee(iteratee));
}

var map_1 = map;

/**
 * Base layer for plugins
 * Provide minimal starting core
 */
class BasePlugin {
  constructor(revogrid) {
    this.revogrid = revogrid;
    this.subscriptions = {};
  }
  /**
   *
   * @param eventName - event name to subscribe to in revo-grid
   * @param callback - callback function for event
   */
  addEventListener(eventName, callback) {
    this.revogrid.addEventListener(eventName, callback);
    this.subscriptions[eventName] = callback;
  }
  /**
   * Subscribe to grid properties to watch changes
   * You can return false in callback to prevent default value set
   *
   * @param prop - property name
   * @param callback - callback function
   * @param immediate - trigger callback immediately with current value
   */
  watch(prop, callback, { immediate } = { immediate: false }) {
    const nativeValueDesc = Object.getOwnPropertyDescriptor(this.revogrid, prop) ||
      Object.getOwnPropertyDescriptor(this.revogrid.constructor.prototype, prop);
    // Overwrite property descriptor for this instance
    Object.defineProperty(this.revogrid, prop, {
      set(val) {
        var _a;
        const keepDefault = callback(val);
        if (keepDefault === false) {
          return;
        }
        // Continue with native behavior
        return (_a = nativeValueDesc === null || nativeValueDesc === void 0 ? void 0 : nativeValueDesc.set) === null || _a === void 0 ? void 0 : _a.call(this, val);
      },
      get() {
        var _a;
        // Continue with native behavior
        return (_a = nativeValueDesc === null || nativeValueDesc === void 0 ? void 0 : nativeValueDesc.get) === null || _a === void 0 ? void 0 : _a.call(this);
      },
    });
    if (immediate) {
      callback(nativeValueDesc === null || nativeValueDesc === void 0 ? void 0 : nativeValueDesc.value);
    }
  }
  /**
   * Remove event subscription
   * @param eventName
   */
  removeEventListener(eventName) {
    this.revogrid.removeEventListener(eventName, this.subscriptions[eventName]);
    delete this.subscriptions[eventName];
  }
  /**
   * Trigger event to grid upper level
   * Event can be cancelled
   * @param eventName
   * @param detail
   * @returns event
   */
  emit(eventName, detail) {
    const event = new CustomEvent(eventName, { detail, cancelable: true });
    this.revogrid.dispatchEvent(event);
    return event;
  }
  /**
   * Clearing inner subscription
   */
  clearSubscriptions() {
    for (let type in this.subscriptions) {
      this.removeEventListener(type);
    }
  }
  /**
   * Minimal destroy implementations
   */
  destroy() {
    this.clearSubscriptions();
  }
}

class GroupingColumnPlugin extends BasePlugin {
  static gatherGroup(res, colData, collection, level = 0) {
    // group template
    const group = Object.assign(Object.assign({}, colData), { level, ids: [] });
    // check columns for update
    for (let k in collection.columns) {
      const key = k;
      const resultItem = res.columns[key];
      const collectionItem = collection.columns[key];
      // if column data
      if (index.isArray_1(resultItem) && index.isArray_1(collectionItem)) {
        // fill columns
        resultItem.push(...collectionItem);
        // fill grouping
        if (collectionItem.length) {
          res.columnGrouping[key].push(Object.assign(Object.assign({}, group), { ids: map_1(collectionItem, 'prop') }));
        }
      }
    }
    // merge column groupings
    for (let k in collection.columnGrouping) {
      const key = k;
      const collectionItem = collection.columnGrouping[key];
      res.columnGrouping[key].push(...collectionItem);
    }
    res.maxLevel = Math.max(res.maxLevel, collection.maxLevel);
    res.sort = Object.assign(Object.assign({}, res.sort), collection.sort);
    return res;
  }
}
function isColGrouping(colData) {
  return !!colData.children;
}

class ColumnDataProvider {
  get order() {
    return index.reduce_1(this.sorting, (r, c, prop) => {
      r[prop] = c.order;
      return r;
    }, {});
  }
  get stores() {
    return this.dataSources;
  }
  constructor() {
    this.sorting = null;
    this.dataSources = index.reduce_1(columnTypes, (sources, k) => {
      sources[k] = new index.DataStore(k);
      return sources;
    }, {});
  }
  column(c, pin) {
    return this.getColumn(c, pin || 'rgCol');
  }
  getColumn(virtualIndex, type) {
    return index.getSourceItem(this.dataSources[type].store, virtualIndex);
  }
  getRawColumns() {
    return index.reduce_1(this.dataSources, (result, item, type) => {
      result[type] = item.store.get('source');
      return result;
    }, {
      rgCol: [],
      colPinStart: [],
      colPinEnd: [],
    });
  }
  getColumns(type = 'all') {
    if (type !== 'all') {
      return this.dataSources[type].store.get('source');
    }
    return columnTypes.reduce((r, t) => {
      r.push(...this.dataSources[t].store.get('source'));
      return r;
    }, []);
  }
  getColumnIndexByProp(prop, type) {
    return index.getSourceItemVirtualIndexByProp(this.dataSources[type].store, prop);
  }
  getColumnByProp(prop, type) {
    const items = this.dataSources[type].store.get('source');
    return find_1(items, { prop });
  }
  refreshByType(type) {
    this.dataSources[type].refresh();
  }
  setColumns(data) {
    columnTypes.forEach(k => {
      // set columns data
      this.dataSources[k].updateData(data.columns[k], {
        // max depth level
        depth: data.maxLevel,
        // groups
        groups: data.columnGrouping[k].reduce((res, g) => {
          if (!res[g.level]) {
            res[g.level] = [];
          }
          res[g.level].push(g);
          return res;
        }, {}),
      });
    });
    this.sorting = data.sort;
    return data;
  }
  updateColumns(cols) {
    // collect column by type and propert
    const columnByKey = cols.reduce((res, c) => {
      const type = ColumnDataProvider.getColumnType(c);
      if (!res[type]) {
        res[type] = {};
      }
      res[type][c.prop] = c;
      return res;
    }, {});
    // find indexes in source
    const colByIndex = {};
    index.each(columnByKey, (colsToUpdate, type) => {
      const items = this.dataSources[type].store.get('source');
      colByIndex[type] = items.reduce((result, rgCol, index) => {
        const colToUpdateIfExists = colsToUpdate[rgCol.prop];
        if (colToUpdateIfExists) {
          result[index] = colToUpdateIfExists;
        }
        return result;
      }, {});
    });
    index.each(colByIndex, (colsToUpdate, type) => index.setSourceByVirtualIndex(this.dataSources[type].store, colsToUpdate));
  }
  updateColumn(column, index$1) {
    const type = ColumnDataProvider.getColumnType(column);
    index.setSourceByVirtualIndex(this.dataSources[type].store, { [index$1]: column });
  }
  updateColumnSorting(column, index, sorting, additive) {
    if (!additive) {
      this.clearSorting();
    }
    column.order = sorting;
    this.sorting[column.prop] = column;
    this.updateColumn(column, index);
    return column;
  }
  clearSorting() {
    const types = index.reduce_1(this.sorting, (r, c) => {
      const k = ColumnDataProvider.getColumnType(c);
      r[k] = true;
      return r;
    }, {});
    index.each(types, (_, type) => {
      const cols = this.dataSources[type].store.get('source');
      index.each(cols, (c) => (c.order = undefined));
      this.dataSources[type].setData({ source: [...cols] });
    });
    this.sorting = {};
  }
  static getSizes(cols) {
    return index.reduce_1(cols, (res, c, i) => {
      if (c.size) {
        res[i] = c.size;
      }
      return res;
    }, {});
  }
  static getColumnByProp(columns, prop) {
    return find_1(columns, c => {
      if (isColGrouping(c)) {
        return ColumnDataProvider.getColumnByProp(c.children, prop);
      }
      return c.prop === prop;
    });
  }
  // columns processing
  static getColumns(columns, level = 0, types) {
    const collection = {
      // columns as they are in stores per type
      columns: {
        rgCol: [],
        colPinStart: [],
        colPinEnd: [],
      },
      // columns grouped by prop for quick access
      columnByProp: {},
      // column grouping
      columnGrouping: {
        rgCol: [],
        colPinStart: [],
        colPinEnd: [],
      },
      // max depth level for column grouping
      maxLevel: level,
      // sorting
      sort: {},
    };
    return index.reduce_1(columns, (res, colData) => {
      // Grouped column
      if (isColGrouping(colData)) {
        return GroupingColumnPlugin.gatherGroup(res, colData, ColumnDataProvider.getColumns(colData.children, level + 1, types), level);
      }
      // Regular column
      const regularColumn = Object.assign(Object.assign({}, (colData.columnType && types && types[colData.columnType])), colData);
      // Regular column, no Pin
      if (!regularColumn.pin) {
        res.columns.rgCol.push(regularColumn);
        // Pin
      }
      else {
        res.columns[regularColumn.pin].push(regularColumn);
      }
      if (regularColumn.order) {
        res.sort[regularColumn.prop] = regularColumn;
      }
      // technically it's possible that some columns have same prop, but better to avoid it
      if (!res.columnByProp[regularColumn.prop]) {
        res.columnByProp[regularColumn.prop] = [];
      }
      res.columnByProp[regularColumn.prop].push(regularColumn);
      // trigger setup hook if present
      regularColumn.beforeSetup && regularColumn.beforeSetup(regularColumn);
      return res;
    }, collection);
  }
  static getColumnType(rgCol) {
    if (rgCol.pin) {
      return rgCol.pin;
    }
    return 'rgCol';
  }
}

class DataProvider {
  constructor(dimensionProvider) {
    this.dimensionProvider = dimensionProvider;
    this.stores = index.reduce_1(rowTypes, (sources, k) => {
      sources[k] = new index.DataStore(k);
      return sources;
    }, {});
  }
  setData(data, type = 'rgRow', grouping, silent = false) {
    // set rgRow data
    this.stores[type].updateData([...data], grouping, silent);
    this.dimensionProvider.setData(data.length, type, type !== 'rgRow');
    return data;
  }
  getModel(virtualIndex, type = 'rgRow') {
    const store = this.stores[type].store;
    return index.getSourceItem(store, virtualIndex);
  }
  setCellData({ type, rowIndex, prop, val }) {
    const model = this.getModel(rowIndex, type);
    model[prop] = val;
    index.setSourceByVirtualIndex(this.stores[type].store, { [rowIndex]: model });
  }
  refresh(type = 'all') {
    if (isRowType(type)) {
      this.refreshItems(type);
    }
    rowTypes.forEach((t) => this.refreshItems(t));
  }
  refreshItems(type = 'rgRow') {
    const items = this.stores[type].store.get('items');
    this.stores[type].setData({ items: [...items] });
  }
  setGrouping({ depth }, type = 'rgRow') {
    this.stores[type].setData({ groupingDepth: depth });
  }
  setTrimmed(trimmed, type = 'rgRow') {
    const store = this.stores[type];
    store.addTrimmed(trimmed);
    this.dimensionProvider.setTrimmed(trimmed, type);
    if (type === 'rgRow') {
      this.dimensionProvider.setData(index.getVisibleSourceItem(store.store).length, type);
    }
  }
}

/**
 * Storing pre-calculated
 * Dimension information and sizes
 */
const trimmedPlugin = (store) => {
  let trimmedSize = {};
  const setTrimmed = (sizes, trimmed) => {
    const newSize = Object.assign({}, sizes);
    trimmedSize = {};
    index.each(trimmed, (v, index) => {
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
    originItemSize: 0 });
}
class DimensionStore {
  constructor() {
    this.store = index.createStore(initialState());
    this.store.use(trimmedPlugin(this));
    this.store.use(realSizePlugin(this));
  }
  getCurrentState() {
    const state = initialState();
    const keys = Object.keys(state);
    return index.reduce_1(keys, (r, k) => {
      const data = this.store.get(k);
      r[k] = data;
      return r;
    }, state);
  }
  dispose() {
    index.setStore(this.store, initialState());
  }
  setStore(data) {
    index.setStore(this.store, data);
  }
  drop() {
    index.setStore(this.store, initialBase());
  }
  /**
   * Set custom dimension sizes and overwrite old
   * Generates new indexes based on sizes
   * @param sizes - sizes to set
   */
  setDimensionSize(sizes) {
    const dimensionData = index.calculateDimensionData(this.store.get('originItemSize'), sizes);
    index.setStore(this.store, dimensionData);
    return dimensionData;
  }
}

/**
 * Dimension provider
 * Stores dimension information and custom sizes
 */
class DimensionProvider {
  constructor(viewports, config) {
    this.viewports = viewports;
    const sizeChanged = viewport_helpers.lodash.debounce((k) => config.realSizeChanged(k), index.RESIZE_INTERVAL);
    this.stores = index.reduce_1([...rowTypes, ...columnTypes], (sources, k) => {
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
    const allTrimmed = index.gatherTrimmedItems(trimmed);
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
    const item = index.getItemByIndex(dimension, e.coordinate);
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

class ViewportProvider {
  constructor() {
    this.stores = index.reduce_1([...rowTypes, ...columnTypes], (sources, k) => {
      sources[k] = new events.ViewportStore(k);
      return sources;
    }, {});
  }
  setViewport(type, data) {
    this.stores[type].setViewport(data);
  }
}

/**
 * Plugin module for revo-grid grid system
 * Add support for automatic column resize
 */
const LETTER_BLOCK_SIZE = 7;
var ColumnAutoSizeMode;
(function (ColumnAutoSizeMode) {
  // increases column width on header click according the largest text value
  ColumnAutoSizeMode["headerClickAutosize"] = "headerClickAutoSize";
  // increases column width on data set and text edit, decreases performance
  ColumnAutoSizeMode["autoSizeOnTextOverlap"] = "autoSizeOnTextOverlap";
  // increases and decreases column width based on all items sizes, worst for performance
  ColumnAutoSizeMode["autoSizeAll"] = "autoSizeAll";
})(ColumnAutoSizeMode || (ColumnAutoSizeMode = {}));
class AutoSizeColumn extends BasePlugin {
  constructor(revogrid, providers, config) {
    super(revogrid);
    this.providers = providers;
    this.config = config;
    this.autoSizeColumns = null;
    /** for edge case when no columns defined before data */
    this.dataResolve = null;
    this.dataReject = null;
    this.letterBlockSize = (config === null || config === void 0 ? void 0 : config.letterBlockSize) || LETTER_BLOCK_SIZE;
    // create test container to check text width
    if (config === null || config === void 0 ? void 0 : config.preciseSize) {
      this.precsizeCalculationArea = this.initiatePresizeElement();
      revogrid.appendChild(this.precsizeCalculationArea);
    }
    const aftersourceset = ({ detail: { source } }) => {
      this.setSource(source);
    };
    const afteredit = ({ detail }) => {
      this.afteredit(detail);
    };
    const afterEditAll = ({ detail }) => {
      this.afterEditAll(detail);
    };
    const beforecolumnsset = ({ detail: { columns } }) => {
      this.columnSet(columns);
    };
    const headerDblClick = ({ detail }) => {
      const type = ColumnDataProvider.getColumnType(detail.column);
      const size = this.getColumnSize(detail.index, type);
      if (size) {
        this.providers.dimensionProvider.setCustomSizes(type, {
          [detail.index]: size,
        }, true);
      }
    };
    this.addEventListener('beforecolumnsset', beforecolumnsset);
    switch (config === null || config === void 0 ? void 0 : config.mode) {
      case ColumnAutoSizeMode.autoSizeOnTextOverlap:
        this.addEventListener('aftersourceset', aftersourceset);
        this.addEventListener('afteredit', afteredit);
        break;
      case ColumnAutoSizeMode.autoSizeAll:
        this.addEventListener('aftersourceset', aftersourceset);
        this.addEventListener('afteredit', afterEditAll);
        break;
      default:
        this.addEventListener('headerdblClick', headerDblClick);
        break;
    }
  }
  async setSource(source) {
    let autoSize = this.autoSizeColumns;
    if (this.dataReject) {
      this.dataReject();
      this.clearPromise();
    }
    /** If data set first and no column provided await until get one */
    if (!autoSize) {
      const request = new Promise((resolve, reject) => {
        this.dataResolve = resolve;
        this.dataReject = reject;
      });
      try {
        autoSize = await request;
      }
      catch (e) {
        return;
      }
    }
    // calculate sizes
    index.each(autoSize, (_v, type) => {
      const sizes = {};
      index.each(autoSize[type], rgCol => {
        // calculate size
        rgCol.size = sizes[rgCol.index] = source.reduce((prev, rgRow) => Math.max(prev, this.getLength(rgRow[rgCol.prop])), this.getLength(rgCol.name || ''));
      });
      this.providers.dimensionProvider.setCustomSizes(type, sizes, true);
    });
  }
  getLength(len) {
    var _a;
    const padding = 15;
    if (!len) {
      return 0;
    }
    try {
      const str = len.toString();
      /**if exact calculation required proxy with html element, slow operation */
      if ((_a = this.config) === null || _a === void 0 ? void 0 : _a.preciseSize) {
        this.precsizeCalculationArea.innerText = str;
        return this.precsizeCalculationArea.scrollWidth + padding * 2;
      }
      return str.length * this.letterBlockSize + padding * 2;
    }
    catch (e) {
      return 0;
    }
  }
  afteredit(e) {
    let data;
    if (this.isRangeEdit(e)) {
      data = e.data;
    }
    else {
      data = { 0: { [e.prop]: e.val } };
    }
    index.each(this.autoSizeColumns, (columns, type) => {
      const sizes = {};
      index.each(columns, rgCol => {
        // calculate size
        const size = index.reduce_1(data, (prev, rgRow) => {
          if (typeof rgRow[rgCol.prop] === 'undefined') {
            return prev;
          }
          return Math.max(prev || 0, this.getLength(rgRow[rgCol.prop]));
        }, undefined);
        if (size && rgCol.size < size) {
          rgCol.size = sizes[rgCol.index] = size;
        }
      });
      this.providers.dimensionProvider.setCustomSizes(type, sizes, true);
    });
  }
  afterEditAll(e) {
    const props = {};
    if (this.isRangeEdit(e)) {
      index.each(e.data, r => index.each(r, (_v, p) => (props[p] = true)));
    }
    else {
      props[e.prop] = true;
    }
    index.each(this.autoSizeColumns, (columns, type) => {
      const sizes = {};
      index.each(columns, rgCol => {
        if (props[rgCol.prop]) {
          const size = this.getColumnSize(rgCol.index, type);
          if (size) {
            sizes[rgCol.index] = size;
          }
        }
      });
      this.providers.dimensionProvider.setCustomSizes(type, sizes, true);
    });
  }
  getColumnSize(index$1, type) {
    const rgCol = this.autoSizeColumns[type][index$1];
    if (!rgCol) {
      return 0;
    }
    return index.reduce_1(this.providers.dataProvider.stores, (r, s) => {
      const perStore = index.reduce_1(s.store.get('items'), (prev, _row, i) => {
        const item = index.getSourceItem(s.store, i);
        return Math.max(prev || 0, this.getLength(item[rgCol.prop]));
      }, 0);
      return Math.max(r, perStore);
    }, rgCol.size || 0);
  }
  columnSet(columns) {
    var _a;
    for (let t of columnTypes) {
      const type = t;
      const cols = columns[type];
      for (let i in cols) {
        if (cols[i].autoSize || ((_a = this.config) === null || _a === void 0 ? void 0 : _a.allColumns)) {
          if (!this.autoSizeColumns) {
            this.autoSizeColumns = {};
          }
          if (!this.autoSizeColumns[type]) {
            this.autoSizeColumns[type] = {};
          }
          this.autoSizeColumns[type][i] = Object.assign(Object.assign({}, cols[i]), { index: parseInt(i, 10) });
        }
      }
    }
    if (this.dataResolve) {
      this.dataResolve(this.autoSizeColumns);
      this.clearPromise();
    }
  }
  clearPromise() {
    this.dataResolve = null;
    this.dataReject = null;
  }
  isRangeEdit(e) {
    return !!e.data;
  }
  initiatePresizeElement() {
    const styleForFontTest = {
      position: 'absolute',
      fontSize: '14px',
      height: '0',
      width: '0',
      whiteSpace: 'nowrap',
      top: '0',
      overflowX: 'scroll',
    };
    const el = document.createElement('div');
    for (let s in styleForFontTest) {
      el.style[s] = styleForFontTest[s];
    }
    el.classList.add('revo-test-container');
    return el;
  }
  destroy() {
    var _a;
    super.destroy();
    (_a = this.precsizeCalculationArea) === null || _a === void 0 ? void 0 : _a.remove();
  }
}

const eq = (value, extra) => {
  if (typeof value === 'undefined' || (value === null && !extra)) {
    return true;
  }
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  const filterVal = extra.toString().toLocaleLowerCase();
  if (filterVal.length === 0) {
    return true;
  }
  return value.toLocaleLowerCase() === filterVal;
};
const notEq = (value, extra) => !eq(value, extra);
notEq.extra = 'input';
eq.extra = 'input';

const gtThan = function (value, extra) {
  let conditionValue;
  if (typeof value === 'number') {
    conditionValue = parseFloat(extra === null || extra === void 0 ? void 0 : extra.toString());
    return value > conditionValue;
  }
  return false;
};
gtThan.extra = 'input';

const gtThanEq = function (value, extra) {
  return eq(value, extra) || gtThan(value, extra);
};
gtThanEq.extra = 'input';

const lt = function (value, extra) {
  let conditionValue;
  if (typeof value === 'number') {
    conditionValue = parseFloat(extra === null || extra === void 0 ? void 0 : extra.toString());
    return value < conditionValue;
  }
  else {
    return false;
  }
};
lt.extra = 'input';

const lsEq = function (value, extra) {
  return eq(value, extra) || lt(value, extra);
};
lsEq.extra = 'input';

const set = (value) => !(value === '' || value === null || value === void 0);
const notSet = (value) => !set(value);

const beginsWith = (value, extra) => {
  if (!value) {
    return false;
  }
  if (!extra) {
    return true;
  }
  if (typeof value !== 'string') {
    value = JSON.stringify(value);
  }
  if (typeof extra !== 'string') {
    extra = JSON.stringify(extra);
  }
  return value.toLocaleLowerCase().indexOf(extra.toLocaleLowerCase()) === 0;
};
beginsWith.extra = 'input';

const contains = (value, extra) => {
  if (!extra) {
    return true;
  }
  if (!value) {
    return false;
  }
  if (extra) {
    if (typeof value !== 'string') {
      value = JSON.stringify(value);
    }
    return value.toLocaleLowerCase().indexOf(extra.toString().toLowerCase()) > -1;
  }
  return true;
};
const notContains = (value, extra) => {
  return !contains(value, extra);
};
notContains.extra = 'input';
contains.extra = 'input';

const filterNames = {
  none: 'None',
  empty: 'Not set',
  notEmpty: 'Set',
  eq: 'Equal',
  notEq: 'Not equal',
  begins: 'Begins with',
  contains: 'Contains',
  notContains: 'Does not contain',
  eqN: '=',
  neqN: '!=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
};
const filterEntities = {
  none: () => true,
  empty: notSet,
  notEmpty: set,
  eq: eq,
  notEq: notEq,
  begins: beginsWith,
  contains: contains,
  notContains: notContains,
  eqN: eq,
  neqN: notEq,
  gt: gtThan,
  gte: gtThanEq,
  lt: lt,
  lte: lsEq,
};
const filterTypes = {
  string: ['notEmpty', 'empty', 'eq', 'notEq', 'begins', 'contains', 'notContains'],
  number: ['notEmpty', 'empty', 'eqN', 'neqN', 'gt', 'gte', 'lt', 'lte'],
};

const FILTER_TRIMMED_TYPE = 'filter';
const FILTER_CONFIG_CHANGED_EVENT = 'filterconfigchanged';
class FilterPlugin extends BasePlugin {
  constructor(revogrid, uiid, config) {
    var _a;
    super(revogrid);
    this.revogrid = revogrid;
    this.filterCollection = {};
    this.multiFilterItems = {};
    this.possibleFilters = Object.assign({}, filterTypes);
    this.possibleFilterNames = Object.assign({}, filterNames);
    this.possibleFilterEntities = Object.assign({}, filterEntities);
    this.filterProp = filter_button.FILTER_PROP;
    if (config) {
      this.initConfig(config);
    }
    const headerclick = (e) => this.headerclick(e);
    const aftersourceset = async () => {
      const filterCollectionProps = Object.keys(this.filterCollection);
      if (filterCollectionProps.length > 0) {
        // handle old way of filtering by reworking FilterCollection to new MultiFilterItem
        filterCollectionProps.forEach((prop, index) => {
          if (!this.multiFilterItems[prop]) {
            this.multiFilterItems[prop] = [
              {
                id: index,
                type: this.filterCollection[prop].type,
                value: this.filterCollection[prop].value,
                relation: 'and',
              },
            ];
          }
        });
      }
      await this.runFiltering();
    };
    this.addEventListener('headerclick', headerclick);
    this.addEventListener(FILTER_CONFIG_CHANGED_EVENT, ({ detail }) => {
      if (!detail) {
        this.clearFiltering();
        return;
      }
      if (typeof detail === 'object') {
        this.initConfig(detail);
      }
      aftersourceset();
    });
    this.addEventListener('aftersourceset', aftersourceset);
    this.addEventListener('filter', ({ detail }) => this.onFilterChange(detail));
    this.revogrid.registerVNode([
      index$1.h("revogr-filter-panel", { uuid: `filter-${uiid}`, filterItems: this.multiFilterItems, filterNames: this.possibleFilterNames, filterEntities: this.possibleFilterEntities, filterCaptions: (_a = config === null || config === void 0 ? void 0 : config.localization) === null || _a === void 0 ? void 0 : _a.captions, onFilterChange: e => this.onFilterChange(e.detail), disableDynamicFiltering: config === null || config === void 0 ? void 0 : config.disableDynamicFiltering, ref: e => (this.pop = e) }),
    ]);
  }
  initConfig(config) {
    if (config.multiFilterItems) {
      this.multiFilterItems = Object.assign({}, config.multiFilterItems);
    }
    if (config.customFilters) {
      for (let cType in config.customFilters) {
        const cFilter = config.customFilters[cType];
        if (!this.possibleFilters[cFilter.columnFilterType]) {
          this.possibleFilters[cFilter.columnFilterType] = [];
        }
        this.possibleFilters[cFilter.columnFilterType].push(cType);
        this.possibleFilterEntities[cType] = cFilter.func;
        this.possibleFilterNames[cType] = cFilter.name;
      }
    }
    if (config.filterProp) {
      this.filterProp = config.filterProp;
    }
    /**
     * which filters has to be included/excluded
     * convinient way to exclude system filters
     */
    if (config.include) {
      const filters = {};
      for (let t in this.possibleFilters) {
        // validate filters, if appropriate function present
        const newTypes = this.possibleFilters[t].filter(f => config.include.indexOf(f) > -1);
        if (newTypes.length) {
          filters[t] = newTypes;
        }
      }
      // if any valid filters provided show them
      if (Object.keys(filters).length > 0) {
        this.possibleFilters = filters;
      }
    }
    if (config.collection) {
      this.filterCollection = viewport_helpers.lodash.reduce(config.collection, (result, item, prop) => {
        if (this.possibleFilterEntities[item.type]) {
          result[prop] = item;
        }
        else {
          console.warn(`${item.type} type is not found.`);
        }
        return result;
      }, {});
    }
    if (config.localization) {
      if (config.localization.filterNames) {
        Object.entries(config.localization.filterNames).forEach(([k, v]) => {
          if (this.possibleFilterNames[k] != void 0) {
            this.possibleFilterNames[k] = v;
          }
        });
      }
    }
  }
  async headerclick(e) {
    var _a;
    const el = (_a = e.detail.originalEvent) === null || _a === void 0 ? void 0 : _a.target;
    if (!filter_button.isFilterBtn(el)) {
      return;
    }
    e.preventDefault();
    // close if same
    const changes = await this.pop.getChanges();
    if (changes && (changes === null || changes === void 0 ? void 0 : changes.prop) === e.detail.prop) {
      this.pop.show();
      return;
    }
    // filter button clicked, open filter dialog
    const gridPos = this.revogrid.getBoundingClientRect();
    const buttonPos = el.getBoundingClientRect();
    const prop = e.detail.prop;
    this.pop.filterTypes = this.getColumnFilter(e.detail.filter);
    this.pop.show(Object.assign(Object.assign({}, this.filterCollection[prop]), { x: buttonPos.x - gridPos.x, y: buttonPos.y - gridPos.y + buttonPos.height, prop }));
  }
  getColumnFilter(type) {
    let filterType = 'string';
    if (!type) {
      return { [filterType]: this.possibleFilters[filterType] };
    }
    // if custom column filter
    if (this.isValidType(type)) {
      filterType = type;
      // if multiple filters applied
    }
    else if (typeof type === 'object' && type.length) {
      return type.reduce((r, multiType) => {
        if (this.isValidType(multiType)) {
          r[multiType] = this.possibleFilters[multiType];
        }
        return r;
      }, {});
    }
    return { [filterType]: this.possibleFilters[filterType] };
  }
  isValidType(type) {
    return !!(typeof type === 'string' && this.possibleFilters[type]);
  }
  // called on internal component change
  async onFilterChange(filterItems) {
    this.multiFilterItems = filterItems;
    this.runFiltering();
  }
  /**
   * Triggers grid filtering
   */
  async doFiltering(collection, items, columns, filterItems) {
    const columnsToUpdate = [];
    columns.forEach(rgCol => {
      const column = Object.assign({}, rgCol);
      const hasFilter = filterItems[column.prop];
      if (column[this.filterProp] && !hasFilter) {
        delete column[this.filterProp];
        columnsToUpdate.push(column);
      }
      if (!column[this.filterProp] && hasFilter) {
        columnsToUpdate.push(column);
        column[this.filterProp] = true;
      }
    });
    const itemsToFilter = this.getRowFilter(items, filterItems);
    // check is filter event prevented
    const { defaultPrevented, detail } = this.emit('beforefiltertrimmed', { collection, itemsToFilter, source: items, filterItems });
    if (defaultPrevented) {
      return;
    }
    // check is trimmed event prevented
    const isAddedEvent = await this.revogrid.addTrimmed(detail.itemsToFilter, FILTER_TRIMMED_TYPE);
    if (isAddedEvent.defaultPrevented) {
      return;
    }
    // applies the hasFilter to the columns to show filter icon
    await this.revogrid.updateColumns(columnsToUpdate);
    this.emit('afterFilterApply');
  }
  async clearFiltering() {
    this.multiFilterItems = {};
    await this.runFiltering();
  }
  async runFiltering() {
    const collection = {};
    // handle old filterCollection to return the first filter only (if any) from multiFilterItems
    const filterProps = Object.keys(this.multiFilterItems);
    for (const prop of filterProps) {
      // check if we have any filter for a column
      if (this.multiFilterItems[prop].length > 0) {
        const firstFilterItem = this.multiFilterItems[prop][0];
        collection[prop] = {
          filter: filterEntities[firstFilterItem.type],
          type: firstFilterItem.type,
          value: firstFilterItem.value,
        };
      }
    }
    this.filterCollection = collection;
    const { source, columns } = await this.getData();
    const { defaultPrevented, detail } = this.emit('beforefilterapply', { collection: this.filterCollection, source, columns, filterItems: this.multiFilterItems });
    if (defaultPrevented) {
      return;
    }
    this.doFiltering(detail.collection, detail.source, detail.columns, detail.filterItems);
  }
  async getData() {
    return {
      source: await this.revogrid.getSource(),
      columns: await this.revogrid.getColumns(),
    };
  }
  getRowFilter(rows, filterItems) {
    const propKeys = Object.keys(filterItems);
    const trimmed = {};
    let propFilterSatisfiedCount = 0;
    let lastFilterResults = [];
    // each rows
    rows.forEach((model, rowIndex) => {
      // working on all props
      for (const prop of propKeys) {
        const propFilters = filterItems[prop];
        propFilterSatisfiedCount = 0;
        lastFilterResults = [];
        // testing each filter for a prop
        for (const [filterIndex, filterData] of propFilters.entries()) {
          // the filter LogicFunction based on the type
          const filter = this.possibleFilterEntities[filterData.type];
          // THE MAGIC OF FILTERING IS HERE
          if (filterData.relation === 'or') {
            lastFilterResults = [];
            if (filter(model[prop], filterData.value)) {
              continue;
            }
            propFilterSatisfiedCount++;
          }
          else {
            // 'and' relation will need to know the next filter
            // so we save this current filter to include it in the next filter
            lastFilterResults.push(!filter(model[prop], filterData.value));
            // check first if we have a filter on the next index to pair it with this current filter
            const nextFilterData = propFilters[filterIndex + 1];
            // stop the sequence if there is no next filter or if the next filter is not an 'and' relation
            if (!nextFilterData || nextFilterData.relation !== 'and') {
              // let's just continue since for sure propFilterSatisfiedCount cannot be satisfied
              if (lastFilterResults.indexOf(true) === -1) {
                lastFilterResults = [];
                continue;
              }
              // we need to add all of the lastFilterResults since we need to satisfy all
              propFilterSatisfiedCount += lastFilterResults.length;
              lastFilterResults = [];
            }
          }
        } // end of propFilters forEach
        // add to the list of removed/trimmed rows of filter condition is satisfied
        if (propFilterSatisfiedCount === propFilters.length)
          trimmed[rowIndex] = true;
      } // end of for-of propKeys
    });
    return trimmed;
  }
}

/** `Object#toString` result references. */
var stringTag = '[object String]';

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!index.isArray_1(value) && debounce.isObjectLike_1(value) && debounce._baseGetTag(value) == stringTag);
}

var isString_1 = isString;

/**
 * Gets the size of an ASCII `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
var asciiSize = index._baseProperty('length');

var _asciiSize = asciiSize;

/** Used to compose unicode character classes. */
var rsAstralRange$1 = '\\ud800-\\udfff',
    rsComboMarksRange$1 = '\\u0300-\\u036f',
    reComboHalfMarksRange$1 = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange$1 = '\\u20d0-\\u20ff',
    rsComboRange$1 = rsComboMarksRange$1 + reComboHalfMarksRange$1 + rsComboSymbolsRange$1,
    rsVarRange$1 = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ$1 = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ$1 + rsAstralRange$1  + rsComboRange$1 + rsVarRange$1 + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

var _hasUnicode = hasUnicode;

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Gets the size of a Unicode `string`.
 *
 * @private
 * @param {string} string The string inspect.
 * @returns {number} Returns the string size.
 */
function unicodeSize(string) {
  var result = reUnicode.lastIndex = 0;
  while (reUnicode.test(string)) {
    ++result;
  }
  return result;
}

var _unicodeSize = unicodeSize;

/**
 * Gets the number of symbols in `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the string size.
 */
function stringSize(string) {
  return _hasUnicode(string)
    ? _unicodeSize(string)
    : _asciiSize(string);
}

var _stringSize = stringSize;

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/**
 * Gets the size of `collection` by returning its length for array-like
 * values or the number of own enumerable string keyed properties for objects.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to inspect.
 * @returns {number} Returns the collection size.
 * @example
 *
 * _.size([1, 2, 3]);
 * // => 3
 *
 * _.size({ 'a': 1, 'b': 2 });
 * // => 2
 *
 * _.size('pebbles');
 * // => 7
 */
function size(collection) {
  if (collection == null) {
    return 0;
  }
  if (index.isArrayLike_1(collection)) {
    return isString_1(collection) ? _stringSize(collection) : collection.length;
  }
  var tag = index._getTag(collection);
  if (tag == mapTag || tag == setTag) {
    return collection.size;
  }
  return index._baseKeys(collection).length;
}

var size_1 = size;

/**
 * lifecycle
 * 1) @event beforesorting - sorting just started, nothing happened yet, can be from column or from source, if type is from rows - column will be undefined
 * 2) @metod updateColumnSorting - column sorting icon applied to grid and column get updated, data still untiuched
 * 3) @event beforesortingapply - before we applied sorting data to data source, you can prevent event and data will not be sorted. It's called only from column sorting click
 * 4) @event afterSortingApply - sorting applied, just finished event, from rows and columns
 *
 * If you prevent event it'll not reach farther steps
 */
class SortingPlugin extends BasePlugin {
  constructor(revogrid) {
    super(revogrid);
    this.revogrid = revogrid;
    // sorting order per column
    this.sorting = null;
    // sorting function per column, multiple columns sorting supported
    this.sortingFunc = null;
    this.doSort = debounce.debounce_1((order, comparison) => this.sort(order, comparison), 50);
    const aftersourceset = async ({ detail: { type } }) => {
      // if sorting was provided - sort data
      if (!!this.sorting && this.sortingFunc) {
        const beforeEvent = this.emit('beforesorting', { type });
        if (beforeEvent.defaultPrevented) {
          return;
        }
        this.doSort(this.sorting, this.sortingFunc);
      }
    };
    const aftercolumnsset = async ({ detail: { order } }) => {
      // const columns = await this.revogrid.getColumns();
      // const sortingFunc: SortingOrderFunction = {};
      // for (let prop in order) {
      //   const cmp = this.getComparer(ColumnDataProvider.getColumnByProp(columns, prop), order[prop]);
      //   sortingFunc[prop] = cmp;
      // }
      // this.doSort(order, sortingFunc);
    };
    const headerclick = async (e) => {
      var _a, _b;
      if (e.defaultPrevented) {
        return;
      }
      if (!e.detail.column.sortable) {
        return;
      }
      this.headerclick(e.detail.column, e.detail.index, (_b = (_a = e.detail) === null || _a === void 0 ? void 0 : _a.originalEvent) === null || _b === void 0 ? void 0 : _b.shiftKey);
    };
    this.addEventListener('after-any-source', aftersourceset);
    this.addEventListener('aftercolumnsset', aftercolumnsset);
    this.addEventListener('initialHeaderClick', headerclick);
  }
  getComparer(column, order) {
    var _a;
    const cellCmp = ((_a = column === null || column === void 0 ? void 0 : column.cellCompare) === null || _a === void 0 ? void 0 : _a.bind({ order })) || this.defaultCellCompare;
    if (order == 'asc') {
      return cellCmp;
    }
    if (order == 'desc') {
      return this.descCellCompare(cellCmp);
    }
    return undefined;
  }
  /**
   * Apply sorting to data on header click
   * If additive - add to existing sorting, multiple columns can be sorted
   */
  async headerclick(column, index, additive) {
    let order = this.getNextOrder(column.order);
    const beforeEvent = this.emit('beforesorting', { column, order, additive });
    if (beforeEvent.defaultPrevented) {
      return;
    }
    order = beforeEvent.detail.order;
    const newCol = await this.revogrid.updateColumnSorting(beforeEvent.detail.column, index, order, additive);
    // apply sort data
    const beforeApplyEvent = this.emit('beforesortingapply', { column: newCol, order, additive });
    if (beforeApplyEvent.defaultPrevented) {
      return;
    }
    order = beforeApplyEvent.detail.order;
    const cmp = this.getComparer(column, order);
    if (additive && this.sorting) {
      const sorting = {};
      const sortingFunc = {};
      this.sorting = Object.assign(Object.assign({}, this.sorting), sorting);
      // extend sorting function with new sorting for multiple columns sorting
      this.sortingFunc = Object.assign(Object.assign({}, this.sortingFunc), sortingFunc);
      if (column.prop in sorting && size_1(sorting) > 1 && order === undefined) {
        delete sorting[column.prop];
        delete sortingFunc[column.prop];
      }
      else {
        sorting[column.prop] = order;
        sortingFunc[column.prop] = cmp;
      }
    }
    else {
      // reset sorting
      this.sorting = { [column.prop]: order };
      this.sortingFunc = { [column.prop]: cmp };
    }
    this.doSort(this.sorting, this.sortingFunc);
  }
  /**
   * Sort items by sorting function
   * @requires proxyItems applied to row store
   * @requires source applied to row store
   *
   * @param sorting - per column sorting
   * @param data - this.stores['rgRow'].store.get('source')
   */
  async sort(sorting, sortingFunc, types = ['rgRow', 'rowPinStart', 'rowPinEnd']) {
    return;
  }
  defaultCellCompare(prop, a, b) {
    var _a, _b;
    const av = (_a = a[prop]) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
    const bv = (_b = b[prop]) === null || _b === void 0 ? void 0 : _b.toString().toLowerCase();
    return av == bv ? 0 : av > bv ? 1 : -1;
  }
  descCellCompare(cmp) {
    return (prop, a, b) => {
      return -1 * cmp(prop, a, b);
    };
  }
  sortIndexByItems(indexes, source, sortingFunc) {
    // if no sorting - return unsorted indexes
    if (Object.entries(sortingFunc).length === 0) {
      // Unsort indexes
      return [...Array(indexes.length).keys()];
    }
    // 
    /**
     * go through all indexes and align in new order
     * performs a multi-level sorting by applying multiple comparison functions to determine the order of the items based on different properties.
     */
    return indexes.sort((a, b) => {
      for (const [prop, cmp] of Object.entries(sortingFunc)) {
        const itemA = source[a];
        const itemB = source[b];
        /**
         * If the comparison function returns a non-zero value (sorted), it means that the items should be sorted based on the given property. In such a case, the function immediately returns the sorted value, indicating the order in which the items should be arranged.
         * If none of the comparison functions result in a non-zero value, indicating that the items are equal or should remain in the same order, the function eventually returns 0.
         */
        const sorted = cmp(prop, itemA, itemB);
        if (sorted) {
          return sorted;
        }
      }
      return 0;
    });
  }
  getNextOrder(currentOrder) {
    switch (currentOrder) {
      case undefined:
        return 'asc';
      case 'asc':
        return 'desc';
      case 'desc':
        return undefined;
    }
  }
}

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

var _baseClamp = baseClamp;

/** Used as references for the maximum length and index of an array. */
var MAX_ARRAY_LENGTH = 4294967295;

/**
 * Converts `value` to an integer suitable for use as the length of an
 * array-like object.
 *
 * **Note:** This method is based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toLength(3.2);
 * // => 3
 *
 * _.toLength(Number.MIN_VALUE);
 * // => 0
 *
 * _.toLength(Infinity);
 * // => 4294967295
 *
 * _.toLength('3.2');
 * // => 3
 */
function toLength(value) {
  return value ? _baseClamp(index.toInteger_1(value), 0, MAX_ARRAY_LENGTH) : 0;
}

var toLength_1 = toLength;

/**
 * The base implementation of `_.fill` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 */
function baseFill(array, value, start, end) {
  var length = array.length;

  start = index.toInteger_1(start);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : index.toInteger_1(end);
  if (end < 0) {
    end += length;
  }
  end = start > end ? 0 : toLength_1(end);
  while (start < end) {
    array[start++] = value;
  }
  return array;
}

var _baseFill = baseFill;

/**
 * Fills elements of `array` with `value` from `start` up to, but not
 * including, `end`.
 *
 * **Note:** This method mutates `array`.
 *
 * @static
 * @memberOf _
 * @since 3.2.0
 * @category Array
 * @param {Array} array The array to fill.
 * @param {*} value The value to fill `array` with.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.fill(array, 'a');
 * console.log(array);
 * // => ['a', 'a', 'a']
 *
 * _.fill(Array(3), 2);
 * // => [2, 2, 2]
 *
 * _.fill([4, 6, 8, 10], '*', 1, 3);
 * // => [4, '*', '*', 10]
 */
function fill(array, value, start, end) {
  var length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  if (start && typeof start != 'number' && index._isIterateeCall(array, value, start)) {
    start = 0;
    end = length;
  }
  return _baseFill(array, value, start, end);
}

var fill_1 = fill;

const INITIAL = {
  mime: 'text/csv',
  fileKind: 'csv',
  // BOM signature
  bom: true,
  columnDelimiter: ',',
  rowDelimiter: '\r\n',
  encoding: '',
};
// The ASCII character code 13 is called a Carriage Return or CR.
const CARRIAGE_RETURN = String.fromCharCode(13);
// Chr(13) followed by a Chr(10) that compose a proper CRLF.
const LINE_FEED = String.fromCharCode(10);
const DOUBLE_QT = String.fromCharCode(34);
const NO_BREAK_SPACE = String.fromCharCode(0xfeff);
const escapeRegex = new RegExp('"', 'g');
class ExportCsv {
  constructor(options = {}) {
    this.options = Object.assign(Object.assign({}, INITIAL), options);
  }
  doExport({ data, headers, props }) {
    let result = this.options.bom ? NO_BREAK_SPACE : '';
    // any header
    if ((headers === null || headers === void 0 ? void 0 : headers.length) > 0) {
      headers.forEach(header => {
        // ignore empty
        if (!header.length) {
          return;
        }
        result += this.prepareHeader(header, this.options.columnDelimiter);
        result += this.options.rowDelimiter;
      });
    }
    data.forEach((rgRow, index) => {
      if (index > 0) {
        result += this.options.rowDelimiter;
      }
      // support grouping
      if (viewport_helpers.isGrouping(rgRow)) {
        result += this.parseCell(viewport_helpers.getGroupingName(rgRow), this.options.columnDelimiter);
        return;
      }
      result += props.map(p => this.parseCell(rgRow[p], this.options.columnDelimiter)).join(this.options.columnDelimiter);
    });
    return result;
  }
  prepareHeader(columnHeaders, columnDelimiter) {
    let result = '';
    const newColumnHeaders = columnHeaders.map(v => this.parseCell(v, columnDelimiter, true));
    result += newColumnHeaders.join(columnDelimiter);
    return result;
  }
  parseCell(value, columnDelimiter, force = false) {
    let escape = value;
    if (typeof value !== 'string') {
      escape = JSON.stringify(value);
    }
    const toEscape = [CARRIAGE_RETURN, DOUBLE_QT, LINE_FEED, columnDelimiter];
    if (typeof escape === 'undefined') {
      return '';
    }
    if (escape !== '' && (force || toEscape.some(i => escape.indexOf(i) >= 0))) {
      return `"${escape.replace(escapeRegex, '""')}"`;
    }
    return escape;
  }
}

var ExportTypes;
(function (ExportTypes) {
  ExportTypes["csv"] = "csv";
})(ExportTypes || (ExportTypes = {}));
class ExportFilePlugin extends BasePlugin {
  /** Exports string */
  async exportString(options = {}, t = ExportTypes.csv) {
    const data = await this.beforeexport();
    if (!data) {
      return null;
    }
    return this.formatter(t, options).doExport(data);
  }
  /** Exports Blob */
  async exportBlob(options = {}, t = ExportTypes.csv) {
    return await this.getBlob(this.formatter(t, options));
  }
  /** Export file */
  async exportFile(options = {}, t = ExportTypes.csv) {
    const formatter = this.formatter(t, options);
    const blob = await this.getBlob(formatter);
    // url
    const URL = window.URL || window.webkitURL;
    const a = document.createElement('a');
    const { filename, fileKind } = formatter.options;
    const name = `${filename}.${fileKind}`;
    const url = URL.createObjectURL(blob);
    a.style.display = 'none';
    a.setAttribute('href', url);
    a.setAttribute('download', name);
    this.revogrid.appendChild(a);
    a.dispatchEvent(new MouseEvent('click'));
    this.revogrid.removeChild(a);
    // delay for revoke, correct for some browsers
    await index.timeout(120);
    URL.revokeObjectURL(url);
  }
  /** Blob object */
  async getBlob(formatter) {
    const type = `${formatter.options.mime};charset=${formatter.options.encoding}`;
    if (typeof Blob !== 'undefined') {
      const data = await this.beforeexport();
      if (!data) {
        return null;
      }
      return new Blob([formatter.doExport(data)], { type });
    }
    return null;
  }
  // before event
  async beforeexport() {
    let data = await this.getData();
    const event = this.emit('beforeexport', { data });
    if (event.defaultPrevented) {
      return null;
    }
    return event.detail.data;
  }
  async getData() {
    const data = await this.getSource();
    const colSource = [];
    const colPromises = [];
    columnTypes.forEach((t, i) => {
      colPromises.push(this.getColPerSource(t).then(s => (colSource[i] = s)));
    });
    await Promise.all(colPromises);
    const columns = {
      headers: [],
      props: [],
    };
    for (let source of colSource) {
      source.headers.forEach((h, i) => {
        if (!columns.headers[i]) {
          columns.headers[i] = [];
        }
        columns.headers[i].push(...h);
      });
      columns.props.push(...source.props);
    }
    return Object.assign({ data }, columns);
  }
  async getColPerSource(t) {
    const store = await this.revogrid.getColumnStore(t);
    const source = store.get('source');
    const virtualIndexes = store.get('items');
    const depth = store.get('groupingDepth');
    const groups = store.get('groups');
    const colNames = [];
    const colProps = [];
    const visibleItems = virtualIndexes.reduce((r, v, virtualIndex) => {
      const prop = source[v].prop;
      colNames.push(source[v].name || '');
      colProps.push(prop);
      r[prop] = virtualIndex;
      return r;
    }, {});
    const rows = this.getGroupHeaders(depth, groups, virtualIndexes, visibleItems);
    rows.push(colNames);
    return {
      headers: rows,
      props: colProps,
    };
  }
  getGroupHeaders(depth, groups, items, visibleItems) {
    const rows = [];
    const template = fill_1(new Array(items.length), '');
    for (let d = 0; d < depth; d++) {
      const rgRow = [...template];
      rows.push(rgRow);
      if (!groups[d]) {
        continue;
      }
      const levelGroups = groups[d];
      // add names of groups
      levelGroups.forEach((group) => {
        const minIndex = this.findGroupStartIndex(group.ids, visibleItems);
        if (typeof minIndex === 'number') {
          rgRow[minIndex] = group.name;
        }
      });
    }
    return rows;
  }
  findGroupStartIndex(ids, visibleItems) {
    let min;
    ids.forEach(id => {
      const current = visibleItems[id];
      if (typeof current === 'number') {
        if (typeof min !== 'number' || min > current) {
          min = current;
        }
      }
    });
    return min;
  }
  async getSource() {
    const data = [];
    const promisesData = [];
    rowTypes.forEach(t => {
      const dataPart = [];
      data.push(dataPart);
      const promise = this.revogrid.getVisibleSource(t).then((d) => dataPart.push(...d));
      promisesData.push(promise);
    });
    await Promise.all(promisesData);
    return data.reduce((r, v) => {
      r.push(...v);
      return r;
    }, []);
  }
  // get correct class for future multiple types support
  formatter(type, options = {}) {
    switch (type) {
      case ExportTypes.csv:
        return new ExportCsv(options);
      default:
        throw new Error('Unknown format');
    }
  }
}

// provide collapse data
function doCollapse(pIndex, source) {
  const model = source[pIndex];
  const collapseValue = model[viewport_helpers.PSEUDO_GROUP_ITEM_VALUE];
  const trimmed = {};
  let i = pIndex + 1;
  const total = source.length;
  while (i < total) {
    const currentModel = source[i];
    if (viewport_helpers.isGrouping(currentModel)) {
      const currentValue = currentModel[viewport_helpers.PSEUDO_GROUP_ITEM_VALUE];
      if (!currentValue.length || !currentValue.startsWith(collapseValue + ',')) {
        break;
      }
      currentModel[viewport_helpers.GROUP_EXPANDED] = false;
    }
    trimmed[i++] = true;
  }
  model[viewport_helpers.GROUP_EXPANDED] = false;
  return { trimmed };
}
/**
 *
 * @param pIndex - physical index
 * @param vIndex - virtual index, need to update item collection
 * @param source - data source
 * @param rowItemsIndexes - rgRow indexes
 */
function doExpand(vIndex, source, rowItemsIndexes) {
  const physicalIndex = rowItemsIndexes[vIndex];
  const model = source[physicalIndex];
  const currentGroup = viewport_helpers.getParsedGroup(model[viewport_helpers.PSEUDO_GROUP_ITEM_ID]);
  const trimmed = {};
  // no group found
  if (!currentGroup) {
    return { trimmed };
  }
  const groupItems = [];
  model[viewport_helpers.GROUP_EXPANDED] = true;
  let i = physicalIndex + 1;
  const total = source.length;
  let groupLevelOnly = 0;
  // go through all rows
  while (i < total) {
    const currentModel = source[i];
    const isGroup = viewport_helpers.isGrouping(currentModel);
    // group found
    if (isGroup) {
      if (!viewport_helpers.isSameGroup(currentGroup, model, currentModel)) {
        break;
      }
      else if (!groupLevelOnly) {
        // if get group first it's group only level
        groupLevelOnly = currentModel[viewport_helpers.GROUP_DEPTH];
      }
    }
    // level 0 or same depth
    if (!groupLevelOnly || (isGroup && groupLevelOnly === currentModel[viewport_helpers.GROUP_DEPTH])) {
      trimmed[i] = false;
      groupItems.push(i);
    }
    i++;
  }
  const result = {
    trimmed,
  };
  if (groupItems.length) {
    const items = [...rowItemsIndexes];
    items.splice(vIndex + 1, 0, ...groupItems);
    result.items = items;
  }
  return result;
}

const TRIMMED_GROUPING = 'grouping';
/**
 * Prepare trimming updated indexes for grouping
 * @param initiallyTrimed
 * @param firstLevelMap
 * @param secondLevelMap
 */
function processDoubleConversionTrimmed(initiallyTrimed, firstLevelMap, secondLevelMap) {
  const trimemedOptionsToUpgrade = {};
  /**
   * go through all groups except grouping
   */
  for (let type in initiallyTrimed) {
    if (type === TRIMMED_GROUPING) {
      continue;
    }
    const items = initiallyTrimed[type];
    const newItems = {};
    for (let initialIndex in items) {
      /**
       * if item exists we find it in collection
       * we support 2 level of conversions
       */
      let newConversionIndex = firstLevelMap[initialIndex];
      if (secondLevelMap) {
        newConversionIndex = secondLevelMap[newConversionIndex];
      }
      /**
       * if item was trimmed previously
       * trimming makes sense to apply
       */
      if (items[initialIndex]) {
        newItems[newConversionIndex] = true;
        /**
         * If changes present apply changes to new source
         */
        if (newConversionIndex !== parseInt(initialIndex, 10)) {
          trimemedOptionsToUpgrade[type] = newItems;
        }
      }
    }
  }
  return trimemedOptionsToUpgrade;
}

class GroupingRowPlugin extends BasePlugin {
  get hasProps() {
    var _a, _b, _c;
    return ((_a = this.options) === null || _a === void 0 ? void 0 : _a.props) && ((_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.props) === null || _c === void 0 ? void 0 : _c.length);
  }
  get store() {
    return this.providers.dataProvider.stores[viewport_helpers.GROUPING_ROW_TYPE].store;
  }
  // proxy for items get
  get rowItems() {
    return this.store.get('items');
  }
  get trimmed() {
    return this.store.get('trimmed');
  }
  constructor(revogrid, providers) {
    super(revogrid);
    this.revogrid = revogrid;
    this.providers = providers;
  }
  // befoce cell focus
  onFocus(e) {
    if (viewport_helpers.isGrouping(e.detail.model)) {
      e.preventDefault();
    }
  }
  // expand event triggered
  onExpand({ virtualIndex }) {
    const { source } = this.getSource();
    let newTrimmed = this.trimmed[TRIMMED_GROUPING];
    let i = index.getPhysical(this.store, virtualIndex);
    const model = source[i];
    const prevExpanded = model[viewport_helpers.GROUP_EXPANDED];
    if (!prevExpanded) {
      const { trimmed, items } = doExpand(virtualIndex, source, this.rowItems);
      newTrimmed = Object.assign(Object.assign({}, newTrimmed), trimmed);
      if (items) {
        index.setItems(this.store, items);
      }
    }
    else {
      const { trimmed } = doCollapse(i, source);
      newTrimmed = Object.assign(Object.assign({}, newTrimmed), trimmed);
      this.revogrid.clearFocus();
    }
    this.store.set('source', source);
    this.revogrid.addTrimmed(newTrimmed, TRIMMED_GROUPING);
  }
  // get source based on proxy item collection to preserve rgRow order
  getSource(withoutGrouping = false) {
    const source = this.store.get('source');
    const items = this.store.get('proxyItems');
    let index = 0;
    // order important here, expected parent is first, then others
    return items.reduce((result, i) => {
      const model = source[i];
      if (!withoutGrouping) {
        result.source.push(model);
        return result;
      }
      // grouping filter
      if (!viewport_helpers.isGrouping(model)) {
        result.source.push(model);
        result.oldNewIndexes[i] = index;
        index++;
      }
      else {
        if (model[viewport_helpers.GROUP_EXPANDED]) {
          result.prevExpanded[model[viewport_helpers.PSEUDO_GROUP_ITEM_VALUE]] = true;
        }
      }
      return result;
    }, {
      source: [],
      prevExpanded: {},
      oldNewIndexes: {},
    });
  }
  setColumnGrouping(cols) {
    // if 0 column as holder
    if (cols === null || cols === void 0 ? void 0 : cols.length) {
      cols[0][viewport_helpers.PSEUDO_GROUP_COLUMN] = true;
      return true;
    }
    return false;
  }
  setColumns({ columns }) {
    for (let type of columnTypes) {
      if (this.setColumnGrouping(columns[type])) {
        break;
      }
    }
  }
  // evaluate drag between groups
  onDrag(e) {
    const { from, to } = e.detail;
    const isDown = to - from >= 0;
    const { source } = this.getSource();
    const items = this.rowItems;
    let i = isDown ? from : to;
    const end = isDown ? to : from;
    for (; i < end; i++) {
      const model = source[items[i]];
      const isGroup = viewport_helpers.isGrouping(model);
      if (isGroup) {
        e.preventDefault();
        return;
      }
    }
  }
  beforeTrimmedApply(trimmed, type) {
    /** Before filter apply remove grouping filtering */
    if (type === FILTER_TRIMMED_TYPE) {
      const source = this.store.get('source');
      for (let index in trimmed) {
        if (trimmed[index] && viewport_helpers.isGrouping(source[index])) {
          trimmed[index] = false;
        }
      }
    }
  }
  // subscribe to grid events to process them accordingly
  subscribe() {
    /** if grouping present and new data source arrived */
    this.addEventListener('beforesourceset', ({ detail }) => this.onDataSet(detail));
    this.addEventListener('beforecolumnsset', ({ detail }) => this.setColumns(detail));
    /**
     * filter applied need to clear grouping and apply again
     * based on new results can be new grouping
     */
    this.addEventListener('beforetrimmed', ({ detail: { trimmed, trimmedType } }) => this.beforeTrimmedApply(trimmed, trimmedType));
    /**
     * sorting applied need to clear grouping and apply again
     * based on new results whole grouping order will changed
     */
    this.addEventListener('afterSortingApply', () => this.doSourceUpdate(Object.assign({}, this.options)));
    /**
     * Apply logic for focus inside of grouping
     * We can't focus on grouping rows, navigation only inside of groups for now
     */
    this.addEventListener('beforecellfocus', e => this.onFocus(e));
    /**
     * Prevent rgRow drag outside the group
     */
    this.addEventListener('roworderchanged', e => this.onDrag(e));
    /**
     * When grouping expand icon was clicked
     */
    this.addEventListener(viewport_helpers.GROUP_EXPAND_EVENT, ({ detail }) => this.onExpand(detail));
  }
  /**
   * Starts global source update with group clearing and applying new one
   * Initiated when need to reapply grouping
   */
  doSourceUpdate(options) {
    var _a;
    if (!this.hasProps) {
      return;
    }
    /**
     * Get source without grouping
     * @param newOldIndexMap - provides us mapping with new indexes vs old indexes, we would use it for trimmed mapping
     */
    const { source, prevExpanded, oldNewIndexes } = this.getSource(true);
    /**
     * Group again
     * @param oldNewIndexMap - provides us mapping with new indexes vs old indexes
     */
    const { sourceWithGroups, depth, trimmed, oldNewIndexMap, childrenByGroup } = viewport_helpers.gatherGrouping(source, ((_a = this.options) === null || _a === void 0 ? void 0 : _a.props) || [], Object.assign({ prevExpanded }, options));
    // setup source
    this.providers.dataProvider.setData(sourceWithGroups, viewport_helpers.GROUPING_ROW_TYPE, { depth, customRenderer: options === null || options === void 0 ? void 0 : options.groupLabelTemplate }, true);
    this.updateTrimmed(trimmed, childrenByGroup, oldNewIndexes, oldNewIndexMap);
  }
  /**
   * Apply grouping on data set
   * Clear grouping from source
   * If source came from other plugin
   */
  onDataSet(data) {
    var _a;
    if (!this.hasProps || !(data === null || data === void 0 ? void 0 : data.source) || !data.source.length) {
      return;
    }
    const source = data.source.filter(s => !viewport_helpers.isGrouping(s));
    const expanded = this.revogrid.grouping || {};
    const { sourceWithGroups, depth, trimmed, oldNewIndexMap, childrenByGroup } = viewport_helpers.gatherGrouping(source, ((_a = this.options) === null || _a === void 0 ? void 0 : _a.props) || [], Object.assign({}, (expanded || {})));
    data.source = sourceWithGroups;
    this.providers.dataProvider.setGrouping({ depth });
    this.updateTrimmed(trimmed, childrenByGroup, oldNewIndexMap);
  }
  // apply grouping
  setGrouping(options) {
    // unsubscribe from all events when group applied
    this.clearSubscriptions();
    this.options = options;
    // clear props, no grouping exists
    if (!options.props || !Object.keys(options.props).length) {
      this.clearGrouping();
      return;
    }
    // props exist and source inited
    const { source } = this.getSource();
    if (source.length) {
      this.doSourceUpdate(Object.assign({}, options));
    }
    // props exist and columns inited
    for (let t of columnTypes) {
      if (this.setColumnGrouping(this.providers.columnProvider.getColumns(t))) {
        this.providers.columnProvider.refreshByType(t);
        break;
      }
    }
    // if has any grouping subscribe to events again
    this.subscribe();
  }
  // clear grouping
  clearGrouping() {
    // clear columns
    columnTypes.forEach(t => {
      const cols = this.providers.columnProvider.getColumns(t);
      let deleted = false;
      cols.forEach(c => {
        if (viewport_helpers.isGroupingColumn(c)) {
          delete c[viewport_helpers.PSEUDO_GROUP_COLUMN];
          deleted = true;
        }
      });
      // if column store had grouping clear and refresh
      if (deleted) {
        this.providers.columnProvider.refreshByType(t);
      }
    });
    // clear rows
    const { source, oldNewIndexes } = this.getSource(true);
    this.providers.dataProvider.setData(source, viewport_helpers.GROUPING_ROW_TYPE, undefined, true);
    this.updateTrimmed(undefined, undefined, oldNewIndexes);
  }
  updateTrimmed(trimmedGroup = {}, _childrenByGroup = {}, firstLevelMap, secondLevelMap) {
    // map previously trimmed data
    const trimemedOptionsToUpgrade = processDoubleConversionTrimmed(this.trimmed, firstLevelMap, secondLevelMap);
    for (let type in trimemedOptionsToUpgrade) {
      this.revogrid.addTrimmed(trimemedOptionsToUpgrade[type], type);
    }
    // const emptyGroups = this.filterOutEmptyGroups(trimemedOptionsToUpgrade, childrenByGroup);
    // setup trimmed data for grouping
    this.revogrid.addTrimmed(Object.assign({}, trimmedGroup), TRIMMED_GROUPING);
  }
}

/**
 * Draw drag
 */
class OrdererService {
  constructor() {
    this.parentY = 0;
  }
  start(parent, { pos, text, event }) {
    var _a;
    const { top } = parent.getBoundingClientRect();
    this.parentY = top;
    if (this.text) {
      this.text.innerText = text;
    }
    this.move(pos);
    this.moveTip({ x: event.x, y: event.y });
    (_a = this.el) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
  }
  end() {
    var _a;
    (_a = this.el) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
  }
  move(pos) {
    this.moveElement(pos.end - this.parentY);
  }
  moveTip({ x, y }) {
    if (!this.draggable) {
      return;
    }
    this.draggable.style.left = `${x}px`;
    this.draggable.style.top = `${y}px`;
  }
  moveElement(y) {
    if (!this.rgRow) {
      return;
    }
    this.rgRow.style.transform = `translateY(${y}px)`;
  }
}
const OrderRenderer = ({ ref }) => {
  const service = new OrdererService();
  ref(service);
  return (index$1.h("div", { class: "draggable-wrapper hidden", ref: e => (service.el = e) },
    index$1.h("div", { class: "draggable", ref: el => (service.draggable = el) },
      index$1.h("span", { class: "revo-alt-icon" }),
      index$1.h("span", { ref: e => (service.text = e) })),
    index$1.h("div", { class: "drag-position", ref: e => (service.rgRow = e) })));
};

const RevoViewPort = ({ viewports, dimensions, orderRef, nakedClick, registerElement, onScroll }, children) => {
  const viewPortClick = (e, el) => {
    if (el === e.target) {
      nakedClick(e);
    }
  };
  let el;
  const typeRow = 'rgRow';
  const typeCol = 'rgCol';
  return [
    index$1.h("div", { class: "main-viewport", ref: e => (el = e), onClick: e => viewPortClick(e, el) },
      index$1.h("div", { class: "viewports" },
        children,
        index$1.h("revogr-scroll-virtual", { class: "vertical", dimension: typeRow, viewportStore: viewports[typeRow].store, dimensionStore: dimensions[typeRow].store, ref: el => registerElement(el, 'rowScroll'), onScrollVirtual: e => onScroll(e.detail) }),
        index$1.h(OrderRenderer, { ref: orderRef }))),
    index$1.h("revogr-scroll-virtual", { class: "horizontal", dimension: typeCol, viewportStore: viewports[typeCol].store, dimensionStore: dimensions[typeCol].store, ref: el => registerElement(el, 'colScroll'), onScrollVirtual: e => onScroll(e.detail) }),
  ];
};

class ViewportService {
  constructor(sv, contentHeight) {
    var _a, _b;
    this.sv = sv;
    (_a = this.sv.selectionStoreConnector) === null || _a === void 0 ? void 0 : _a.beforeUpdate();
    this.columns = this.getViewportColumnData(contentHeight);
    (_b = this.sv.scrollingService) === null || _b === void 0 ? void 0 : _b.unregister();
  }
  onColumnResize(type, { detail }, store) {
    var _a;
    (_a = this.sv.dimensionProvider) === null || _a === void 0 ? void 0 : _a.setCustomSizes(type, detail, true);
    const changedItems = viewport_helpers.lodash.reduce(detail || {}, (r, size, i) => {
      const index$1 = parseInt(i, 10);
      const item = index.getSourceItem(store, index$1);
      if (item) {
        r[index$1] = Object.assign(Object.assign({}, item), { size });
      }
      return r;
    }, {});
    this.sv.resize(changedItems);
  }
  /**
   * Transform data from stores and apply it to different components
   * Handle columns
   */
  getViewportColumnData(contentHeight) {
    const columns = [];
    let x = 0; // we increase x only if column present
    columnTypes.forEach(val => {
      const colStore = this.sv.columnProvider.stores[val].store;
      // only columns that have data show
      if (!colStore.get('items').length) {
        return;
      }
      const column = {
        colType: val,
        position: { x, y: 1 },
        contentHeight,
        fixWidth: val !== 'rgCol',
        uuid: `${this.sv.uuid}-${x}`,
        viewports: this.sv.viewportProvider.stores,
        dimensions: this.sv.dimensionProvider.stores,
        rowStores: this.sv.dataProvider.stores,
        colStore,
        onHeaderresize: e => this.onColumnResize(val, e, colStore),
      };
      if (val === 'rgCol') {
        column.onResizeViewport = (e) => { var _a; return (_a = this.sv.viewportProvider) === null || _a === void 0 ? void 0 : _a.setViewport(e.detail.dimension, { virtualSize: e.detail.size }); };
      }
      const colData = this.gatherColumnData(column);
      const columnSelectionStore = this.registerCol(colData.position.x, val);
      // render per each column data collections vertically
      const dataPorts = this.dataViewPort(column).reduce((r, rgRow) => {
        // register selection store for Segment
        const segmentSelection = this.registerSegment(rgRow.position);
        segmentSelection.setLastCell(rgRow.lastCell);
        // register selection store for Row
        const rowSelectionStore = this.registerRow(rgRow.position.y, rgRow.type);
        const rowDef = Object.assign(Object.assign({}, rgRow), { rowSelectionStore, segmentSelectionStore: segmentSelection.store, ref: (e) => this.sv.selectionStoreConnector.registerSection(e), onSetRange: e => {
            segmentSelection.setRangeArea(e.detail);
          }, onSetTempRange: e => {
            segmentSelection.setTempArea(e.detail);
          }, onFocusCell: e => {
            // todo: multi focus
            segmentSelection.clearFocus();
            this.sv.selectionStoreConnector.focus(segmentSelection, e.detail);
          } });
        r.push(rowDef);
        return r;
      }, []);
      columns.push(Object.assign(Object.assign({}, colData), { columnSelectionStore,
        dataPorts }));
      x++;
    });
    return columns;
  }
  /** register selection store for Segment */
  registerSegment(position) {
    return this.sv.selectionStoreConnector.register(position);
  }
  /** register selection store for Row */
  registerRow(y, type) {
    return this.sv.selectionStoreConnector.registerRow(y, type).store;
  }
  /** register selection store for Column */
  registerCol(x, type) {
    return this.sv.selectionStoreConnector.registerColumn(x, type).store;
  }
  /** Collect Column data */
  gatherColumnData(data) {
    const parent = data.uuid;
    const realSize = data.dimensions[data.colType].store.get('realSize');
    const prop = {
      contentWidth: realSize,
      class: data.colType,
      [`${index.UUID}`]: data.uuid,
      contentHeight: data.contentHeight,
      key: data.colType,
      onResizeViewport: data.onResizeViewport,
    };
    if (data.fixWidth) {
      prop.style = { minWidth: `${realSize}px` };
    }
    const headerProp = {
      parent,
      colData: index.getVisibleSourceItem(data.colStore),
      dimensionCol: data.dimensions[data.colType].store,
      groups: data.colStore.get('groups'),
      groupingDepth: data.colStore.get('groupingDepth'),
      resizeHandler: data.colType === 'colPinEnd' ? ['l'] : undefined,
      onHeaderresize: data.onHeaderresize,
    };
    return {
      prop,
      type: data.colType,
      position: data.position,
      headerProp,
      parent,
      viewportCol: data.viewports[data.colType].store,
    };
  }
  /** Collect Row data */
  dataViewPort(data) {
    const slots = {
      rowPinStart: viewport_helpers.HEADER_SLOT,
      rgRow: viewport_helpers.CONTENT_SLOT,
      rowPinEnd: viewport_helpers.FOOTER_SLOT,
    };
    // y position for selection
    let y = 0;
    return rowTypes.reduce((r, type) => {
      // filter out empty sources, we still need to return source to keep slot working
      const isPresent = data.viewports[type].store.get('realCount') || type === 'rgRow';
      const rgCol = Object.assign(Object.assign({}, data), { position: Object.assign(Object.assign({}, data.position), { y: isPresent ? y : viewport_helpers.EMPTY_INDEX }) });
      r.push(this.dataPartition(rgCol, type, slots[type], type !== 'rgRow'));
      if (isPresent) {
        y++;
      }
      return r;
    }, []);
  }
  dataPartition(data, type, slot, fixed) {
    return {
      colData: data.colStore,
      viewportCol: data.viewports[data.colType].store,
      viewportRow: data.viewports[type].store,
      lastCell: viewport_helpers.getLastCell(data, type),
      slot,
      type,
      canDrag: !fixed,
      position: data.position,
      uuid: `${data.uuid}-${data.position.x}-${data.position.y}`,
      dataStore: data.rowStores[type].store,
      dimensionCol: data.dimensions[data.colType].store,
      dimensionRow: data.dimensions[type].store,
      style: fixed ? { height: `${data.dimensions[type].store.get('realSize')}px` } : undefined,
    };
  }
  scrollToCell(cell) {
    for (let key in cell) {
      const coordinate = cell[key];
      this.sv.scrollingService.scrollService({ dimension: key === 'x' ? 'rgCol' : 'rgRow', coordinate });
    }
  }
  /**
   * Clear current grid focus
   */
  clearFocused() {
    this.sv.selectionStoreConnector.clearAll();
  }
  clearEdit() {
    this.sv.selectionStoreConnector.setEdit(false);
  }
  /**
   * Collect focused element data
   */
  getFocused() {
    const focused = this.sv.selectionStoreConnector.focusedStore;
    if (!focused) {
      return null;
    }
    // get column data
    const colType = this.sv.selectionStoreConnector.storesXToType[focused.position.x];
    const column = this.sv.columnProvider.getColumn(focused.cell.x, colType);
    // get row data
    const rowType = this.sv.selectionStoreConnector.storesYToType[focused.position.y];
    const model = this.sv.dataProvider.getModel(focused.cell.y, rowType);
    return {
      column,
      model,
      cell: focused.cell,
      colType,
      rowType,
    };
  }
  getStoreCoordinateByType(colType, rowType) {
    const stores = this.sv.selectionStoreConnector.storesByType;
    const storeCoordinate = {
      x: stores[colType],
      y: stores[rowType],
    };
    return storeCoordinate;
  }
  setFocus(colType, rowType, start, end) {
    var _a;
    (_a = this.sv.selectionStoreConnector) === null || _a === void 0 ? void 0 : _a.focusByCell(this.getStoreCoordinateByType(colType, rowType), start, end);
  }
  getSelectedRange() {
    return this.sv.selectionStoreConnector.selectedRange;
  }
  setEdit(rowIndex, colIndex, colType, rowType) {
    var _a;
    (_a = this.sv.selectionStoreConnector) === null || _a === void 0 ? void 0 : _a.setEditByCell(this.getStoreCoordinateByType(colType, rowType), { x: colIndex, y: rowIndex });
  }
}

function isMobileDevice() {
  return /Mobi/i.test(navigator.userAgent) || /Android/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0;
}

/**
 * The code renders a view port divided into sections.
 * It starts by rendering the pinned start, data, and pinned end sections.
 * Within each section, it renders columns along with their headers, pinned top, center data, and pinned bottom.
 * The code iterates over the columns and their data to generate the view port's HTML structure.
 * Finally, the rendered sections are returned as the result.
 */
const ViewPortSections = ({ resize, editors, rowClass, readonly, range, columns, useClipboard, columnFilter, applyEditorChangesOnClose, additionalData, onCancelEdit, registerElement, onEdit, scrollSection, focusTemplate, onSelectAll, scrollSectionSilent, }) => {
  const isMobile = isMobileDevice();
  const viewPortHtml = [];
  /** render viewports columns */
  for (let view of columns) {
    /** render viewports rows */
    const headerProperties = Object.assign(Object.assign({}, view.headerProp), { type: view.type, additionalData, viewportCol: view.viewportCol, selectionStore: view.columnSelectionStore, canResize: resize, columnFilter });
    const dataViews = [
      index$1.h("revogr-header", Object.assign({}, headerProperties, { slot: viewport_helpers.HEADER_SLOT })),
    ];
    view.dataPorts.forEach((data, j) => {
      const key = view.prop.key + (j + 1);
      const dataView = (index$1.h("revogr-overlay-selection", Object.assign({}, data, { isMobileDevice: isMobile, selectionStore: data.segmentSelectionStore, onSelectall: () => onSelectAll(), editors: editors, readonly: readonly, range: range, useClipboard: useClipboard, onCancelEdit: () => onCancelEdit(), applyChangesOnClose: applyEditorChangesOnClose, onSetEdit: ({ detail }) => onEdit(detail), additionalData: additionalData, slot: data.slot }),
        index$1.h("revogr-data", Object.assign({}, data, { [index.UUID]: data.uuid }, { key: key, readonly: readonly, range: range, rowClass: rowClass, rowSelectionStore: data.rowSelectionStore, additionalData: additionalData, slot: viewport_helpers.DATA_SLOT }),
          index$1.h("slot", { name: `data-${view.type}-${data.type}` })),
        index$1.h("revogr-temp-range", { selectionStore: data.segmentSelectionStore, dimensionRow: data.dimensionRow, dimensionCol: data.dimensionCol }),
        index$1.h("revogr-focus", { colData: data.colData, dataStore: data.dataStore, focusTemplate: focusTemplate, rowType: data.type, colType: view.type, selectionStore: data.segmentSelectionStore, dimensionRow: data.dimensionRow, dimensionCol: data.dimensionCol },
          index$1.h("slot", { name: `focus-${view.type}-${data.type}` }))));
      dataViews.push(dataView);
    });
    viewPortHtml.push(index$1.h("revogr-viewport-scroll", Object.assign({}, view.prop, { ref: el => registerElement(el, view.prop.key), onScrollViewport: e => scrollSection(e.detail, view.prop.key), onSilentScroll: e => scrollSectionSilent(e.detail, view.prop.key) }), dataViews));
  }
  return viewPortHtml;
};

class GridScrollingService {
  constructor(setViewport) {
    this.setViewport = setViewport;
    this.elements = {};
  }
  async scrollService(e, key) {
    let newEvent;
    let event = e;
    for (let elKey in this.elements) {
      if (e.dimension === 'rgCol' && elKey === 'headerRow') {
        continue;
        // pinned column only
      }
      else if (this.isPinnedColumn(key) && e.dimension === 'rgCol') {
        if (elKey === key || !e.delta) {
          continue;
        }
        for (let el of this.elements[elKey]) {
          if (el.changeScroll) {
            newEvent = el.changeScroll(e);
          }
        }
      }
      else {
        for (let el of this.elements[elKey]) {
          await el.setScroll(e);
        }
      }
    }
    if (newEvent) {
      event = await newEvent;
    }
    this.setViewport(event);
  }
  /**
   * Silent scroll update for mobile devices when we have negative scroll top
   */
  async scrollSilentService(e, key) {
    var _a;
    for (let elKey in this.elements) {
      // skip same element update
      if (elKey === key) {
        continue;
      }
      if (columnTypes.includes(key) && (elKey === 'headerRow' || columnTypes.includes(elKey))) {
        for (let el of this.elements[elKey]) {
          await ((_a = el.changeScroll) === null || _a === void 0 ? void 0 : _a.call(el, e, true));
        }
        continue;
      }
    }
  }
  isPinnedColumn(key) {
    return ['colPinStart', 'colPinEnd'].indexOf(key) > -1;
  }
  registerElements(els) {
    this.elements = els;
  }
  /**
   * Register new element for farther scroll support
   * @param el - can be null if holder removed
   * @param key - element key
   */
  registerElement(el, key) {
    if (!this.elements[key]) {
      this.elements[key] = [];
    }
    // new element added
    if (el) {
      this.elements[key].push(el);
    }
    else if (this.elements[key]) {
      // element removed
      delete this.elements[key];
    }
  }
  unregister() {
    delete this.elements;
    this.elements = {};
  }
}

class StretchColumn extends BasePlugin {
  constructor(revogrid, providers) {
    super(revogrid);
    this.providers = providers;
    this.stretchedColumn = null;
    // calculate scroll bar size for current user session
    this.scrollSize = index.getScrollbarWidth(document);
    // subscribe to column changes
    const beforecolumnapplied = ({ detail: { columns } }) => this.applyStretch(columns);
    this.addEventListener('beforecolumnapplied', beforecolumnapplied);
  }
  setScroll({ type, hasScroll }) {
    var _a;
    if (type === 'rgRow' && this.stretchedColumn && ((_a = this.stretchedColumn) === null || _a === void 0 ? void 0 : _a.initialSize) === this.stretchedColumn.size) {
      if (hasScroll) {
        this.stretchedColumn.size -= this.scrollSize;
        this.apply();
        this.dropChanges();
      }
    }
  }
  activateChanges() {
    const setScroll = ({ detail }) => this.setScroll(detail);
    this.addEventListener('scrollchange', setScroll);
  }
  dropChanges() {
    this.stretchedColumn = null;
    this.removeEventListener('scrollchange');
  }
  apply() {
    if (!this.stretchedColumn) {
      return;
    }
    const type = 'rgCol';
    const sizes = this.providers.dimensionProvider.stores[type].store.get('sizes');
    this.providers.dimensionProvider.setCustomSizes(type, Object.assign(Object.assign({}, sizes), { [this.stretchedColumn.index]: this.stretchedColumn.size }), true);
  }
  /**
   * Apply stretch changes
   */
  applyStretch(columns) {
    // unsubscribe from all events
    this.dropChanges();
    // calculate grid size
    let sizeDifference = this.revogrid.clientWidth - 1;
    viewport_helpers.lodash.each(columns, (_, type) => {
      const realSize = this.providers.dimensionProvider.stores[type].store.get('realSize');
      sizeDifference -= realSize;
    });
    if (this.revogrid.rowHeaders) {
      const itemsLength = this.providers.dataProvider.stores.rgRow.store.get('source').length;
      const header = this.revogrid.rowHeaders;
      const rowHeaderSize = events.calculateRowHeaderSize(itemsLength, typeof header === 'object' ? header : undefined);
      if (rowHeaderSize) {
        sizeDifference -= rowHeaderSize;
      }
    }
    if (sizeDifference > 0) {
      // currently plugin accepts last column only
      const index = columns.rgCol.length - 1;
      const last = columns.rgCol[index];
      /**
       * has column
       * no auto size applied
       * size for column shouldn't be defined
       */
      const colSize = (last === null || last === void 0 ? void 0 : last.size) || this.revogrid.colSize || 0;
      const size = sizeDifference + colSize - 1;
      if (last && !last.autoSize && colSize < size) {
        this.stretchedColumn = {
          initialSize: size,
          index,
          size,
        };
        this.apply();
        this.activateChanges();
      }
    }
  }
}
/**
 * Check plugin type is Stretch
 */
function isStretchPlugin(plugin) {
  return !!plugin.applyStretch;
}

const rowDefinitionByType = (newVal = []) => {
  return index.reduce_1(newVal, (r, v) => {
    if (!r[v.type]) {
      r[v.type] = {};
    }
    if (v.size) {
      if (!r[v.type].sizes) {
        r[v.type].sizes = {};
      }
      r[v.type].sizes[v.index] = v.size;
    }
    return r;
  }, {});
};
const rowDefinitionRemoveByType = (oldVal = []) => {
  return index.reduce_1(oldVal, (r, v) => {
    if (!r[v.type]) {
      r[v.type] = [];
    }
    if (v.size) {
      r[v.type].push(v.index);
    }
    return r;
  }, {});
};

const COLUMN_DRAG_CLASS = 'column-drag-start';
class ColumnOrderHandler {
  constructor() {
    this.offset = 0;
  }
  renderAutoscroll(_, parent) {
    if (!parent) {
      return;
    }
    this.autoscrollEl = document.createElement('div');
    this.autoscrollEl.classList.add('drag-auto-scroll-y');
    parent.appendChild(this.autoscrollEl);
  }
  autoscroll(pos, dataContainerSize, direction = 'translateX') {
    if (!this.autoscrollEl) {
      return;
    }
    const helperOffset = 10;
    // calculate current y position inside of the grid active holder
    // 3 - size of element + border
    const maxScroll = Math.min(pos + helperOffset, dataContainerSize - 3);
    this.autoscrollEl.style.transform = `${direction}(${maxScroll}px)`;
    this.autoscrollEl.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }
  start(e, { dataEl, gridRect, scrollEl, gridEl }, dir = 'left') {
    gridEl.classList.add(COLUMN_DRAG_CLASS);
    const scrollContainerRect = scrollEl.getBoundingClientRect();
    if (scrollContainerRect) {
      this.offset = scrollContainerRect[dir] - gridRect[dir];
    }
    this.renderAutoscroll(e, dataEl);
  }
  stop(gridEl) {
    var _a;
    gridEl.classList.remove(COLUMN_DRAG_CLASS);
    if (this.element) {
      this.element.hidden = true;
    }
    this.offset = 0;
    (_a = this.autoscrollEl) === null || _a === void 0 ? void 0 : _a.remove();
    this.autoscrollEl = undefined;
  }
  showHandler(pos, size, direction = 'translateX') {
    if (!this.element) {
      return;
    }
    // do not allow overcross top of the scrollable area, header excluded
    if (this.offset) {
      pos = Math.max(pos, this.offset);
    }
    // can not be bigger then grid end
    pos = Math.min(pos, size);
    this.element.style.transform = `${direction}(${pos}px)`;
    this.element.hidden = false;
  }
  render() {
    return index$1.h("div", { class: "drag-position-y", hidden: true, ref: (el) => (this.element = el) });
  }
}

/**
 * Plugin for column manual move
 */
const COLUMN_CLICK = 'column-click';
const MOVE = 'column-mouse-move';
const DRAG_END = 'column-drag-end';
const BEFORE_DRAG_END = 'before-column-drag-end';
// use this event subscription to drop D&D for particular columns
const DRAG_START = 'column-drag-start';
class ColumnPlugin extends BasePlugin {
  constructor(revogrid, providers) {
    super(revogrid);
    this.revogrid = revogrid;
    this.providers = providers;
    this.moveFunc = debounce.debounce_1((e) => this.doMove(e), 5);
    this.staticDragData = null;
    this.dragData = null;
    this.localSubscriptions = {};
    this.orderUi = new ColumnOrderHandler();
    revogrid.registerVNode([this.orderUi.render()]);
    revogrid.classList.add('column-draggable');
    /** Register events */
    this.localSubscriptions['mouseleave'] = {
      target: document,
      callback: (e) => this.onMouseOut(e),
    };
    this.localSubscriptions['mouseup'] = {
      target: document,
      callback: (e) => this.onMouseUp(e),
    };
    this.localSubscriptions['mousemove'] = {
      target: document,
      callback: (e) => this.move(e),
    };
    this.addEventListener(COLUMN_CLICK, ({ detail }) => this.dragStart(detail));
  }
  dragStart({ event, data }) {
    if (event.defaultPrevented) {
      return;
    }
    const { defaultPrevented } = dispatcher.dispatch(this.revogrid, DRAG_START, data);
    // check if allowed to drag particulat column
    if (defaultPrevented) {
      return;
    }
    this.clearOrder();
    const { mouseleave, mouseup, mousemove } = this.localSubscriptions;
    mouseleave.target.addEventListener('mouseleave', mouseleave.callback);
    mouseup.target.addEventListener('mouseup', mouseup.callback);
    const dataEl = event.target.closest('revogr-header');
    const scrollEl = event.target.closest('revogr-viewport-scroll');
    if (!dataEl || !scrollEl) {
      return;
    }
    if (isColGrouping(data)) {
      return;
    }
    const cols = this.getDimension(data.pin || 'rgCol');
    const gridRect = this.revogrid.getBoundingClientRect();
    const elRect = dataEl.getBoundingClientRect();
    const startItem = index.getItemByPosition(cols, getLeftRelative(event.x, gridRect.left, elRect.left - gridRect.left));
    this.staticDragData = {
      startPos: event.x,
      startItem,
      data,
      dataEl,
      scrollEl,
      gridEl: this.revogrid,
      cols,
    };
    this.dragData = this.getData(this.staticDragData);
    mousemove.target.addEventListener('mousemove', mousemove.callback);
    this.orderUi.start(event, Object.assign(Object.assign({}, this.dragData), this.staticDragData));
  }
  doMove(e) {
    if (!this.staticDragData) {
      return;
    }
    const dragData = (this.dragData = this.getData(this.staticDragData));
    if (!dragData) {
      return;
    }
    const start = this.staticDragData.startPos;
    if (Math.abs(start - e.x) > 10) {
      const x = getLeftRelative(e.x, this.dragData.gridRect.left, this.dragData.scrollOffset);
      const rgCol = index.getItemByPosition(this.staticDragData.cols, x);
      this.orderUi.autoscroll(x, dragData.elRect.width);
      this.orderUi.showHandler(rgCol.end + dragData.scrollOffset, dragData.gridRect.width);
    }
  }
  move(e) {
    dispatcher.dispatch(this.revogrid, MOVE, e);
    // then do move
    this.moveFunc(e);
  }
  onMouseOut(_) {
    this.clearOrder();
  }
  onMouseUp(e) {
    // apply new positions
    if (this.dragData) {
      let relativePos = getLeftRelative(e.x, this.dragData.gridRect.left, this.dragData.scrollOffset);
      if (relativePos < 0) {
        relativePos = 0;
      }
      const newPosition = index.getItemByPosition(this.staticDragData.cols, relativePos);
      const store = this.providers.column.stores[this.dragData.type].store;
      const items = [...store.get('items')];
      // prevent position change if needed
      const { defaultPrevented: stopDrag } = dispatcher.dispatch(this.revogrid, BEFORE_DRAG_END, Object.assign(Object.assign({}, this.staticDragData), { startPosition: this.staticDragData.startItem, newPosition, newItem: store.get('source')[items[this.staticDragData.startItem.itemIndex]] }));
      if (!stopDrag) {
        // todo: if move item out of group remove item from group
        const toMove = items.splice(this.staticDragData.startItem.itemIndex, 1);
        items.splice(newPosition.itemIndex, 0, ...toMove);
        store.set('items', items);
      }
      dispatcher.dispatch(this.revogrid, DRAG_END, this.dragData);
    }
    this.clearOrder();
  }
  clearLocalSubscriptions() {
    index.each(this.localSubscriptions, ({ target, callback }, key) => target.removeEventListener(key, callback));
  }
  clearOrder() {
    this.staticDragData = null;
    this.dragData = null;
    this.clearLocalSubscriptions();
    this.orderUi.stop(this.revogrid);
  }
  /**
   * Clearing subscription
   */
  clearSubscriptions() {
    super.clearSubscriptions();
    this.clearLocalSubscriptions();
  }
  getData({ gridEl, dataEl, data, }) {
    const gridRect = gridEl.getBoundingClientRect();
    const elRect = dataEl.getBoundingClientRect();
    const scrollOffset = elRect.left - gridRect.left;
    return {
      elRect,
      gridRect,
      type: data.pin || 'rgCol',
      scrollOffset,
    };
  }
  getDimension(type) {
    return this.providers.dimension.stores[type].getCurrentState();
  }
}
function getLeftRelative(absoluteX, gridPos, offset) {
  return absoluteX - gridPos - offset;
}

const revoGridStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}revo-grid[theme=default]{font-size:12px}revo-grid[theme=default] revogr-header{text-align:center;line-height:30px;background-color:#f8f9fa}revo-grid[theme=default] revogr-header .group-rgRow{box-shadow:none}revo-grid[theme=default] revogr-header .header-rgRow,revo-grid[theme=default] revogr-header .group-rgRow{text-transform:uppercase;font-size:12px;color:#61656a}revo-grid[theme=default] revogr-header .header-rgRow{height:30px;box-shadow:0 -1px 0 0 #c0c0c0 inset}revo-grid[theme=default] revogr-header .rgHeaderCell{box-shadow:-1px 0 0 0 #c0c0c0, -1px 0 0 0 #c0c0c0 inset, 0 -1px 0 0 #c0c0c0, 0 -1px 0 0 #c0c0c0 inset}revo-grid[theme=default] revogr-header .rgHeaderCell.focused-cell{background:rgba(233, 234, 237, 0.5)}revo-grid[theme=default] .rowHeaders{background-color:#f8f9fa}revo-grid[theme=default] .rowHeaders revogr-data .rgCell{color:#61656a;box-shadow:0 -1px 0 0 #c0c0c0 inset, -1px 0 0 0 #c0c0c0 inset}revo-grid[theme=default] .rowHeaders revogr-header{box-shadow:0 -1px 0 0 #c0c0c0 inset, -1px 0 0 0 #c0c0c0 inset}revo-grid[theme=default] revogr-viewport-scroll.colPinStart revogr-data .rgRow .rgCell:last-child{box-shadow:0 -1px 0 0 #e2e3e3 inset, -1px 0 0 0 #c0c0c0 inset}revo-grid[theme=default] revogr-viewport-scroll.colPinStart .footer-wrapper revogr-data .rgRow:first-child .rgCell{box-shadow:0 1px 0 0 #c0c0c0 inset, -1px 0 0 0 #c0c0c0 inset}revo-grid[theme=default] revogr-viewport-scroll.colPinEnd,revo-grid[theme=default] revogr-viewport-scroll.colPinEnd revogr-header{box-shadow:1px 0 0 #c0c0c0 inset}revo-grid[theme=default] .footer-wrapper revogr-data .rgRow:first-child .rgCell{box-shadow:0 1px 0 0 #e2e3e3 inset, -1px 0 0 0 #e2e3e3 inset, 0 -1px 0 0 #e2e3e3 inset}revo-grid[theme=default] revogr-data{text-align:center}revo-grid[theme=default] revogr-data .rgRow{line-height:27px;box-shadow:0 -1px 0 0 #e2e3e3 inset, -1px 0 0 0 #e2e3e3 inset}revo-grid[theme=default] revogr-data .rgRow.focused-rgRow{background-color:rgba(233, 234, 237, 0.5)}revo-grid[theme=default] revogr-data .rgCell{box-shadow:0 -1px 0 0 #e2e3e3 inset, -1px 0 0 0 #e2e3e3 inset}revo-grid[theme=default] revogr-data .rgCell.disabled{background-color:0 -1px 0 0 #e2e3e3 inset, -1px 0 0 0 #e2e3e3 inset}revo-grid[theme=material]{font-family:Nunito, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"}revo-grid[theme=material] revogr-header{line-height:50px;font-weight:600;text-align:left}revo-grid[theme=material] revogr-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}revo-grid[theme=material] revogr-header .header-rgRow{height:50px}revo-grid[theme=material] revogr-data{text-align:left}revo-grid[theme=material] revogr-data .rgRow{line-height:42px}revo-grid[theme=material] revogr-data .rgCell{padding:0 15px}revo-grid[theme=material] .viewports{width:100%}revo-grid[theme=material] .rowHeaders{background-color:#f7faff}revo-grid[theme=material] .rowHeaders revogr-data .rgCell{color:#757a82}revo-grid[theme=material] revogr-header .header-rgRow.group{box-shadow:0 -1px 0 0 #f1f1f1 inset}revo-grid[theme=material] revogr-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 #f1f1f1, 0 -1px 0 0 #f1f1f1 inset}revo-grid[theme=material] revogr-header .rgHeaderCell.sortable:hover{background-color:#f1f1f1}revo-grid[theme=material] revogr-header .rgHeaderCell.focused-cell{background:rgba(233, 234, 237, 0.5)}revo-grid[theme=material] .footer-wrapper revogr-data{box-shadow:0 -1px 0 #f1f1f1}revo-grid[theme=material] revogr-viewport-scroll.colPinStart{box-shadow:-1px 0 0 #f1f1f1 inset}revo-grid[theme=material] revogr-viewport-scroll.colPinEnd{box-shadow:-1px 0 0 #f1f1f1}revo-grid[theme=material] revogr-data .rgRow{box-shadow:0 -1px 0 0 #f1f1f1 inset}revo-grid[theme=material] revogr-data .rgRow.focused-rgRow{background-color:rgba(233, 234, 237, 0.5)}revo-grid[theme=material] revogr-data .rgCell{color:rgba(0, 0, 0, 0.87)}revo-grid[theme=material] revogr-data .rgCell.disabled{background-color:#f7f7f7}revo-grid[theme=material] revogr-data .revo-draggable>.revo-drag-icon{background-color:#d4d4d4}revo-grid[theme=material] revogr-data .revo-draggable:hover>.revo-drag-icon{background-color:black}revo-grid[theme=darkMaterial]{font-family:Nunito, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";color:#d8d8d8}revo-grid[theme=darkMaterial] revogr-header{line-height:50px;font-weight:600;text-align:left}revo-grid[theme=darkMaterial] revogr-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}revo-grid[theme=darkMaterial] revogr-header .header-rgRow{height:50px}revo-grid[theme=darkMaterial] revogr-data{text-align:left}revo-grid[theme=darkMaterial] revogr-data .rgRow{line-height:42px}revo-grid[theme=darkMaterial] revogr-data .rgCell{padding:0 15px}revo-grid[theme=darkMaterial] .viewports{width:100%}revo-grid[theme=darkMaterial] .rowHeaders{background-color:rgba(40, 39, 43, 0.8)}revo-grid[theme=darkMaterial] .rowHeaders revogr-data .rgCell{color:rgba(216, 216, 216, 0.8)}revo-grid[theme=darkMaterial] revogr-header .header-rgRow.group{box-shadow:0 -1px 0 0 #404040 inset}revo-grid[theme=darkMaterial] revogr-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 #404040, 0 -1px 0 0 #404040 inset}revo-grid[theme=darkMaterial] revogr-header .rgHeaderCell.sortable:hover{background-color:rgba(64, 64, 64, 0.5)}revo-grid[theme=darkMaterial] revogr-header .rgHeaderCell.focused-cell{background:rgba(115, 148, 160, 0.15)}revo-grid[theme=darkMaterial] .footer-wrapper revogr-data{box-shadow:0 -1px 0 #404040}revo-grid[theme=darkMaterial] revogr-data .rgCell{color:rgba(216, 216, 216, 0.9)}revo-grid[theme=darkMaterial] revogr-data .rgRow{box-shadow:0 -1px 0 0 #404040 inset}revo-grid[theme=darkMaterial] revogr-data .rgRow.focused-rgRow{background-color:rgba(115, 148, 160, 0.15)}revo-grid[theme=darkMaterial] revogr-data .revo-draggable>.revo-drag-icon{background-color:rgba(216, 216, 216, 0.5)}revo-grid[theme=darkMaterial] revogr-data .revo-draggable:hover>.revo-drag-icon{background-color:rgba(216, 216, 216, 0.7)}revo-grid[theme=darkMaterial] revogr-viewport-scroll.colPinStart{box-shadow:-1px 0 0 #404040 inset}revo-grid[theme=darkMaterial] revogr-viewport-scroll.colPinEnd{box-shadow:-1px 0 0 #404040}revo-grid[theme=darkCompact]{font-family:Nunito, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";color:#d8d8d8}revo-grid[theme=darkCompact] revogr-header{line-height:45px;font-weight:600;text-align:left}revo-grid[theme=darkCompact] revogr-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}revo-grid[theme=darkCompact] revogr-header .header-rgRow{height:45px}revo-grid[theme=darkCompact] revogr-data{text-align:left}revo-grid[theme=darkCompact] revogr-data .rgRow{line-height:32px}revo-grid[theme=darkCompact] revogr-data .rgCell{padding:0 15px}revo-grid[theme=darkCompact] .viewports{width:100%}revo-grid[theme=darkCompact] .rowHeaders{background-color:rgba(40, 39, 43, 0.8)}revo-grid[theme=darkCompact] .rowHeaders revogr-data .rgCell{color:rgba(216, 216, 216, 0.8)}revo-grid[theme=darkCompact] revogr-header .header-rgRow.group{box-shadow:0 -1px 0 0 #404040 inset}revo-grid[theme=darkCompact] revogr-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 #404040, 0 -1px 0 0 #404040 inset}revo-grid[theme=darkCompact] revogr-header .rgHeaderCell.sortable:hover{background-color:rgba(64, 64, 64, 0.5)}revo-grid[theme=darkCompact] revogr-header .rgHeaderCell.focused-cell{background:rgba(115, 148, 160, 0.15)}revo-grid[theme=darkCompact] .footer-wrapper revogr-data{box-shadow:0 -1px 0 #404040}revo-grid[theme=darkCompact] revogr-data .rgCell{color:rgba(216, 216, 216, 0.9)}revo-grid[theme=darkCompact] revogr-data .rgRow{box-shadow:0 -1px 0 0 #404040 inset}revo-grid[theme=darkCompact] revogr-data .rgRow.focused-rgRow{background-color:rgba(115, 148, 160, 0.15)}revo-grid[theme=darkCompact] revogr-data .revo-draggable>.revo-drag-icon{background-color:rgba(216, 216, 216, 0.5)}revo-grid[theme=darkCompact] revogr-data .revo-draggable:hover>.revo-drag-icon{background-color:rgba(216, 216, 216, 0.7)}revo-grid[theme=darkCompact] revogr-viewport-scroll.colPinStart{box-shadow:-1px 0 0 #404040 inset}revo-grid[theme=darkCompact] revogr-viewport-scroll.colPinEnd{box-shadow:-1px 0 0 #404040}revo-grid[theme=compact]{font-family:Nunito, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"}revo-grid[theme=compact] revogr-header{line-height:45px;font-weight:600;text-align:left}revo-grid[theme=compact] revogr-header .rgHeaderCell{padding:0 15px;text-overflow:ellipsis}revo-grid[theme=compact] revogr-header .header-rgRow{height:45px}revo-grid[theme=compact] revogr-data{text-align:left}revo-grid[theme=compact] revogr-data .rgRow{line-height:32px}revo-grid[theme=compact] revogr-data .rgCell{padding:0 15px}revo-grid[theme=compact] .viewports{width:100%}revo-grid[theme=compact] .rowHeaders{background-color:#f7faff}revo-grid[theme=compact] .rowHeaders revogr-data .rgCell{color:#757a82}revo-grid[theme=compact] revogr-header .header-rgRow.group{box-shadow:0 -1px 0 0 #f1f1f1 inset}revo-grid[theme=compact] revogr-header .header-rgRow:not(.group){box-shadow:0 -1px 0 0 #f1f1f1, 0 -1px 0 0 #f1f1f1 inset}revo-grid[theme=compact] revogr-header .rgHeaderCell.sortable:hover{background-color:#f1f1f1}revo-grid[theme=compact] revogr-header .rgHeaderCell.focused-cell{background:rgba(233, 234, 237, 0.5)}revo-grid[theme=compact] .footer-wrapper revogr-data{box-shadow:0 -1px 0 #f1f1f1}revo-grid[theme=compact] revogr-viewport-scroll.colPinStart{box-shadow:-1px 0 0 #f1f1f1 inset}revo-grid[theme=compact] revogr-viewport-scroll.colPinEnd{box-shadow:-1px 0 0 #f1f1f1}revo-grid[theme=compact] revogr-data .rgRow{box-shadow:0 -1px 0 0 #f1f1f1 inset}revo-grid[theme=compact] revogr-data .rgRow.focused-rgRow{background-color:rgba(233, 234, 237, 0.5)}revo-grid[theme=compact] revogr-data .rgCell{color:rgba(0, 0, 0, 0.87)}revo-grid[theme=compact] revogr-data .rgCell.disabled{background-color:#f7f7f7}revo-grid[theme=compact] revogr-data .revo-draggable>.revo-drag-icon{background-color:#d4d4d4}revo-grid[theme=compact] revogr-data .revo-draggable:hover>.revo-drag-icon{background-color:black}revo-grid[theme=compact] revo-dropdown .rv-dr-root{padding:0px 9px}revo-grid{display:block;height:100%;font-family:Helvetica, Arial, Sans-Serif, serif;font-size:14px;position:relative;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;display:flex;flex-direction:column;width:100%;height:100%}revo-grid.column-draggable.column-drag-start:hover,revo-grid.column-draggable.column-drag-start *:hover{cursor:grabbing}revo-grid .footer-wrapper,revo-grid .header-wrapper{width:100%}revo-grid .footer-wrapper revogr-data,revo-grid .header-wrapper revogr-data{z-index:3}revo-grid revo-dropdown{width:100%}revo-grid revo-dropdown .rv-dr-root{max-height:100%}revo-grid revo-dropdown.shrink label{opacity:0}revo-grid .viewports{max-height:100%;display:flex;flex-direction:row;align-items:flex-start;max-width:100%}revo-grid .main-viewport{flex-grow:1;height:0;display:flex;flex-direction:row}revo-grid .draggable{position:fixed;height:30px;line-height:30px;background:#fff;border-radius:3px;display:block;z-index:100;margin-top:5px;margin-right:-20px;box-shadow:0 4px 20px 0 rgba(0, 0, 0, 0.15);padding-left:20px;padding-right:5px}revo-grid .draggable.hidden{display:none}revo-grid .draggable .revo-alt-icon{background-color:black;position:absolute;left:5px;top:10px}revo-grid .draggable-wrapper.hidden{display:none}revo-grid .drag-position{position:absolute;left:0;right:0;height:1px;z-index:2;background:gray;pointer-events:none}revo-grid .drag-position-y{position:absolute;top:0;left:0;bottom:0;width:1px;z-index:2;background:gray;pointer-events:none}revo-grid .drag-auto-scroll-y{pointer-events:none;position:absolute;left:0;top:0;height:50px;width:1px}revo-grid .clipboard{position:absolute;left:0;top:0}revo-grid revogr-scroll-virtual{position:relative}revo-grid revogr-scroll-virtual.vertical,revo-grid revogr-scroll-virtual.horizontal{z-index:3}";

const RevoGridComponent = class {
  constructor(hostRef) {
    index$1.registerInstance(this, hostRef);
    this.contentsizechanged = index$1.createEvent(this, "contentsizechanged", 7);
    this.beforeedit = index$1.createEvent(this, "beforeedit", 7);
    this.beforerangeedit = index$1.createEvent(this, "beforerangeedit", 7);
    this.afteredit = index$1.createEvent(this, "afteredit", 7);
    this.beforeautofill = index$1.createEvent(this, "beforeautofill", 7);
    this.beforeange = index$1.createEvent(this, "beforeange", 7);
    this.afterfocus = index$1.createEvent(this, "afterfocus", 7);
    this.roworderchanged = index$1.createEvent(this, "roworderchanged", 7);
    this.beforesourcesortingapply = index$1.createEvent(this, "beforesourcesortingapply", 7);
    this.beforesortingapply = index$1.createEvent(this, "beforesortingapply", 7);
    this.beforesorting = index$1.createEvent(this, "beforesorting", 7);
    this.rowdragstart = index$1.createEvent(this, "rowdragstart", 7);
    this.headerclick = index$1.createEvent(this, "headerclick", 7);
    this.beforecellfocus = index$1.createEvent(this, "beforecellfocus", 7);
    this.beforefocuslost = index$1.createEvent(this, "beforefocuslost", 7);
    this.beforesourceset = index$1.createEvent(this, "beforesourceset", 7);
    this.beforeAnySource = index$1.createEvent(this, "before-any-source", 7);
    this.aftersourceset = index$1.createEvent(this, "aftersourceset", 7);
    this.afterAnySource = index$1.createEvent(this, "after-any-source", 7);
    this.beforecolumnsset = index$1.createEvent(this, "beforecolumnsset", 7);
    this.beforecolumnapplied = index$1.createEvent(this, "beforecolumnapplied", 7);
    this.aftercolumnsset = index$1.createEvent(this, "aftercolumnsset", 7);
    this.beforefilterapply = index$1.createEvent(this, "beforefilterapply", 7);
    this.beforefiltertrimmed = index$1.createEvent(this, "beforefiltertrimmed", 7);
    this.beforetrimmed = index$1.createEvent(this, "beforetrimmed", 7);
    this.aftertrimmed = index$1.createEvent(this, "aftertrimmed", 7);
    this.viewportscroll = index$1.createEvent(this, "viewportscroll", 7);
    this.beforeexport = index$1.createEvent(this, "beforeexport", 7);
    this.beforeeditstart = index$1.createEvent(this, "beforeeditstart", 7);
    this.aftercolumnresize = index$1.createEvent(this, "aftercolumnresize", 7);
    this.beforerowdefinition = index$1.createEvent(this, "beforerowdefinition", 7);
    this.filterconfigchanged = index$1.createEvent(this, "filterconfigchanged", 7);
    this.rowheaderschanged = index$1.createEvent(this, "rowheaderschanged", 7);
    // --------------------------------------------------------------------------
    //
    //  Listeners outside scope
    //
    // --------------------------------------------------------------------------
    this.clickTrackForFocusClear = null;
    this.uuid = null;
    this.viewport = null;
    /**
     * Plugins
     * Define plugins collection
     */
    this.internalPlugins = [];
    this.rowHeaders = undefined;
    this.frameSize = 1;
    this.rowSize = 0;
    this.colSize = 100;
    this.range = false;
    this.readonly = false;
    this.resize = false;
    this.canFocus = true;
    this.useClipboard = true;
    this.columns = [];
    this.source = [];
    this.pinnedTopSource = [];
    this.pinnedBottomSource = [];
    this.rowDefinitions = [];
    this.editors = {};
    this.applyOnClose = false;
    this.plugins = undefined;
    this.columnTypes = {};
    this.theme = 'default';
    this.rowClass = '';
    this.autoSizeColumn = false;
    this.filter = false;
    this.focusTemplate = undefined;
    this.canMoveColumns = false;
    this.trimmedRows = {};
    this.exporting = false;
    this.grouping = undefined;
    this.stretch = true;
    this.additionalData = {};
    this.extraElements = [];
  }
  // --------------------------------------------------------------------------
  //
  //  Methods
  //
  // --------------------------------------------------------------------------
  /**
   * Refreshes data viewport.
   * Can be specific part as rgRow or pinned rgRow or 'all' by default.
   */
  async refresh(type = 'all') {
    this.dataProvider.refresh(type);
  }
  /**  Scrolls view port to specified rgRow index */
  async scrollToRow(coordinate = 0) {
    const y = this.dimensionProvider.getViewPortPos({
      coordinate,
      dimension: 'rgRow',
    });
    await this.scrollToCoordinate({ y });
  }
  /** Scrolls view port to specified column index */
  async scrollToColumnIndex(coordinate = 0) {
    const x = this.dimensionProvider.getViewPortPos({
      coordinate,
      dimension: 'rgCol',
    });
    await this.scrollToCoordinate({ x });
  }
  /**  Scrolls view port to specified column prop */
  async scrollToColumnProp(prop) {
    const coordinate = this.columnProvider.getColumnIndexByProp(prop, 'rgCol');
    if (coordinate < 0) {
      // already on the screen
      return;
    }
    const x = this.dimensionProvider.getViewPortPos({
      coordinate,
      dimension: 'rgCol',
    });
    await this.scrollToCoordinate({ x });
  }
  /** Update columns */
  async updateColumns(cols) {
    this.columnProvider.updateColumns(cols);
  }
  /** Add trimmed by type */
  async addTrimmed(trimmed, trimmedType = 'external', type = 'rgRow') {
    const event = this.beforetrimmed.emit({
      trimmed,
      trimmedType,
      type,
    });
    if (event.defaultPrevented) {
      return event;
    }
    this.dataProvider.setTrimmed({ [trimmedType]: event.detail.trimmed }, type);
    this.aftertrimmed.emit();
    return event;
  }
  /**  Scrolls view port to coordinate */
  async scrollToCoordinate(cell) {
    var _a;
    (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.scrollToCell(cell);
  }
  /**  Bring cell to edit mode */
  async setCellEdit(rgRow, prop, rowSource = 'rgRow') {
    var _a;
    const rgCol = ColumnDataProvider.getColumnByProp(this.columns, prop);
    if (!rgCol) {
      return;
    }
    await index.timeout();
    const colGroup = rgCol.pin || 'rgCol';
    (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.setEdit(rgRow, this.columnProvider.getColumnIndexByProp(prop, colGroup), colGroup, rowSource);
  }
  /**  Set focus range */
  async setCellsFocus(cellStart = { x: 0, y: 0 }, cellEnd = { x: 0, y: 0 }, colType = 'rgCol', rowType = 'rgRow') {
    var _a;
    (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.setFocus(colType, rowType, cellStart, cellEnd);
  }
  /**
   * Register new virtual node inside of grid
   * Used for additional items creation such as plugin elements
   */
  async registerVNode(elements) {
    this.extraElements.push(...elements);
    this.extraElements = [...this.extraElements];
  }
  /**  Get data from source */
  async getSource(type = 'rgRow') {
    return this.dataProvider.stores[type].store.get('source');
  }
  /**
   * Get data from visible part of source
   * Trimmed/filtered rows will be excluded
   * @param type - type of source
   */
  async getVisibleSource(type = 'rgRow') {
    return index.getVisibleSourceItem(this.dataProvider.stores[type].store);
  }
  /**
   * Provides access to rows internal store observer
   * Can be used for plugin support
   * @param type - type of source
   */
  async getSourceStore(type = 'rgRow') {
    return this.dataProvider.stores[type].store;
  }
  /**
   * Provides access to column internal store observer
   * Can be used for plugin support
   * @param type - type of column
   */
  async getColumnStore(type = 'rgCol') {
    return this.columnProvider.stores[type].store;
  }
  /**
   * Update column sorting
   * @param column - full column details to update
   * @param index - virtual column index
   * @param order - order to apply
   */
  async updateColumnSorting(column, index, order, additive) {
    return this.columnProvider.updateColumnSorting(column, index, order, additive);
  }
  /**
   * Clears column sorting
   */
  async clearSorting() {
    this.columnProvider.clearSorting();
  }
  /**
   * Receive all columns in data source
   */
  async getColumns() {
    return this.columnProvider.getColumns();
  }
  /**
   * Clear current grid focus
   */
  async clearFocus() {
    var _a;
    const focused = (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.getFocused();
    const event = this.beforefocuslost.emit(focused);
    if (event.defaultPrevented) {
      return;
    }
    this.selectionStoreConnector.clearAll();
  }
  /**
   * Get all active plugins instances
   */
  async getPlugins() {
    return [...this.internalPlugins];
  }
  /**
   * Get the currently focused cell.
   */
  async getFocused() {
    var _a;
    return (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.getFocused();
  }
  /**
   * Get size of content
   * Including all pinned data
   */
  async getContentSize() {
    var _a;
    return (_a = this.dimensionProvider) === null || _a === void 0 ? void 0 : _a.getFullSize();
  }
  /**
   * Get the currently selected Range.
   */
  async getSelectedRange() {
    var _a;
    return (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.getSelectedRange();
  }
  mousedownHandle(event) {
    const screenX = events.getFromEvent(event, 'screenX');
    const screenY = events.getFromEvent(event, 'screenY');
    if (screenX === null || screenY === null) {
      return;
    }
    this.clickTrackForFocusClear = screenX + screenY;
  }
  mouseupHandle(event) {
    const screenX = events.getFromEvent(event, 'screenX');
    const screenY = events.getFromEvent(event, 'screenY');
    if (screenX === null || screenY === null) {
      return;
    }
    if (event.defaultPrevented) {
      return;
    }
    const target = event.target;
    const pos = screenX + screenY;
    // detect if mousemove then do nothing
    if (Math.abs(this.clickTrackForFocusClear - pos) > 10) {
      return;
    }
    // check if action finished inside of the document
    // clear data which is outside of grid
    // if event prevented or it is current table don't clear focus
    if (target === null || target === void 0 ? void 0 : target.closest(`[${index.UUID}="${this.uuid}"]`)) {
      return;
    }
    this.clearFocus();
  }
  // --------------------------------------------------------------------------
  //
  //  Listeners
  //
  // --------------------------------------------------------------------------
  /** DRAG AND DROP */
  onRowDragStarted(e) {
    var _a;
    // e.cancelBubble = true;
    const dragStart = this.rowdragstart.emit(e.detail);
    if (dragStart.defaultPrevented) {
      e.preventDefault();
      return;
    }
    (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.start(this.element, Object.assign(Object.assign({}, e.detail), dragStart.detail));
  }
  onRowDragEnd() {
    var _a;
    (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.end();
  }
  onRowDrag({ detail }) {
    var _a;
    (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.move(detail);
  }
  onRowMouseMove(e) {
    var _a;
    // e.cancelBubble = true;
    (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.moveTip(e.detail);
  }
  async onBeforeEdit(e) {
    // e.cancelBubble = true;
    const { defaultPrevented, detail } = this.beforeedit.emit(e.detail);
    await index.timeout();
    // apply data
    if (!defaultPrevented) {
      this.dataProvider.setCellData(detail);
      this.afteredit.emit(detail);
    }
  }
  onBeforeRangeEdit(e) {
    // e.cancelBubble = true;
    const { defaultPrevented, detail } = this.beforerangeedit.emit(e.detail);
    if (defaultPrevented) {
      e.preventDefault();
      return;
    }
    this.afteredit.emit(detail);
  }
  onRangeChanged(e) {
    // e.cancelBubble = true;
    const beforeange = this.beforeange.emit(e.detail);
    if (beforeange.defaultPrevented) {
      e.preventDefault();
    }
    const beforeFill = this.beforeautofill.emit(beforeange.detail);
    if (beforeFill.defaultPrevented) {
      e.preventDefault();
    }
  }
  onRowDropped(e) {
    // e.cancelBubble = true;
    const { defaultPrevented } = this.roworderchanged.emit(e.detail);
    if (defaultPrevented) {
      e.preventDefault();
    }
  }
  onHeaderClick(e) {
    const { defaultPrevented } = this.headerclick.emit(Object.assign(Object.assign({}, e.detail.column), { originalEvent: e.detail.originalEvent }));
    if (defaultPrevented) {
      e.preventDefault();
    }
  }
  onCellFocus(e) {
    // e.cancelBubble = true;
    const { defaultPrevented } = this.beforecellfocus.emit(e.detail);
    if (!this.canFocus || defaultPrevented) {
      e.preventDefault();
    }
  }
  /**
   * Column format change will trigger column structure update
   */
  columnTypesChanged() {
    this.columnChanged(this.columns);
  }
  columnChanged(newVal = []) {
    // clear existing data
    this.dimensionProvider.dropColumns();
    const columnGather = ColumnDataProvider.getColumns(newVal, 0, this.columnTypes);
    this.beforecolumnsset.emit(columnGather);
    for (let type of columnTypes) {
      const items = columnGather.columns[type];
      this.dimensionProvider.setNewColumns(type, items.length, ColumnDataProvider.getSizes(items), type !== 'rgCol');
    }
    this.beforecolumnapplied.emit(columnGather);
    const columns = this.columnProvider.setColumns(columnGather);
    this.aftercolumnsset.emit({
      columns,
      order: this.columnProvider.order,
    });
  }
  rowSizeChanged(s) {
    this.dimensionProvider.setSettings({ originItemSize: s }, 'rgRow');
    rowTypes.forEach((t) => {
      this.dimensionProvider.clearSize(t, this.dataProvider.stores[t].store.get('source').length);
      this.dimensionProvider.setCustomSizes(t, {}, true);
    });
  }
  themeChanged(t) {
    this.themeService.register(t);
    this.dimensionProvider.setSettings({ originItemSize: this.themeService.rowSize }, 'rgRow');
    this.dimensionProvider.setSettings({ originItemSize: this.colSize }, 'rgCol');
  }
  dataSourceChanged(newVal = [], _, watchName) {
    let type = 'rgRow';
    switch (watchName) {
      case 'pinnedBottomSource':
        type = 'rowPinEnd';
        break;
      case 'pinnedTopSource':
        type = 'rowPinStart';
        break;
      case 'source':
        type = 'rgRow';
        /** applied for source only for cross compatability between plugins */
        const beforesourceset = this.beforesourceset.emit({
          type,
          source: newVal,
        });
        newVal = beforesourceset.detail.source;
        break;
    }
    const beforesourceset = this.beforeAnySource.emit({
      type,
      source: newVal,
    });
    const newSource = [...beforesourceset.detail.source];
    this.dataProvider.setData(newSource, type);
    /** applied for source only for cross compatability between plugins */
    if (watchName === 'source') {
      this.aftersourceset.emit({
        type,
        source: newVal,
      });
    }
    this.afterAnySource.emit({
      type,
      source: newVal,
    });
  }
  rowDefChanged(after, before) {
    const { detail: { vals: newVal, oldVals: oldVal } } = this.beforerowdefinition.emit({
      vals: after,
      oldVals: before
    });
    // apply new vals
    const newRows = rowDefinitionByType(newVal);
    // clear current defs
    if (oldVal) {
      const remove = rowDefinitionRemoveByType(oldVal);
      // clear all old data and drop sizes
      index.each(remove, (_, t) => {
        this.dimensionProvider.clearSize(t, this.dataProvider.stores[t].store.get('source').length);
      });
    }
    if (!newVal.length) {
      return;
    }
    index.each(newRows, (r, k) => this.dimensionProvider.setCustomSizes(k, r.sizes || {}));
  }
  trimmedRowsChanged(newVal = {}) {
    this.addTrimmed(newVal);
  }
  /**
   * Grouping
   */
  groupingChanged(newVal = {}) {
    let grPlugin;
    for (let p of this.internalPlugins) {
      const isGrouping = p;
      if (isGrouping.setGrouping) {
        grPlugin = isGrouping;
        break;
      }
    }
    if (!grPlugin) {
      return;
    }
    grPlugin.setGrouping(newVal || {});
  }
  /**
   * Stretch Plugin Apply
   */
  applyStretch(isStretch) {
    if (isStretch === 'false') {
      isStretch = false;
    }
    let stretch = this.internalPlugins.filter(p => isStretchPlugin(p))[0];
    if ((typeof isStretch === 'boolean' && isStretch) || isStretch === 'true') {
      if (!stretch) {
        this.internalPlugins.push(new StretchColumn(this.element, {
          dataProvider: this.dataProvider,
          columnProvider: this.columnProvider,
          dimensionProvider: this.dimensionProvider,
        }));
      }
      else if (isStretchPlugin(stretch)) {
        stretch.applyStretch(this.columnProvider.getRawColumns());
      }
    }
    else if (stretch) {
      const index = this.internalPlugins.indexOf(stretch);
      this.internalPlugins.splice(index, 1);
    }
  }
  applyFilter(cfg) {
    this.filterconfigchanged.emit(cfg);
  }
  rowHeadersChange(rowHeaders) {
    this.rowheaderschanged.emit(rowHeaders);
  }
  connectedCallback() {
    this.viewportProvider = new ViewportProvider();
    this.themeService = new ThemeService({
      rowSize: this.rowSize,
    });
    const dimensionProviderConfig = {
      realSizeChanged: (k) => this.contentsizechanged.emit(k),
    };
    this.dimensionProvider = new DimensionProvider(this.viewportProvider, dimensionProviderConfig);
    this.columnProvider = new ColumnDataProvider();
    this.selectionStoreConnector = new viewport_helpers.SelectionStoreConnector();
    this.dataProvider = new DataProvider(this.dimensionProvider);
    this.uuid = `${new Date().getTime()}-rvgrid`;
    const pluginData = {
      data: this.dataProvider,
      column: this.columnProvider,
      dimension: this.dimensionProvider,
      viewport: this.viewportProvider,
      selection: this.selectionStoreConnector,
    };
    if (this.autoSizeColumn) {
      this.internalPlugins.push(new AutoSizeColumn(this.element, {
        dataProvider: this.dataProvider,
        columnProvider: this.columnProvider,
        dimensionProvider: this.dimensionProvider,
      }, typeof this.autoSizeColumn === 'object' ? this.autoSizeColumn : undefined));
    }
    if (this.filter) {
      this.internalPlugins.push(new FilterPlugin(this.element, this.uuid, typeof this.filter === 'object' ? this.filter : undefined));
    }
    if (this.exporting) {
      this.internalPlugins.push(new ExportFilePlugin(this.element));
    }
    this.internalPlugins.push(new SortingPlugin(this.element));
    this.internalPlugins.push(new GroupingRowPlugin(this.element, {
      dataProvider: this.dataProvider,
      columnProvider: this.columnProvider,
    }));
    if (this.canMoveColumns) {
      this.internalPlugins.push(new ColumnPlugin(this.element, pluginData));
    }
    if (this.plugins) {
      this.plugins.forEach(p => {
        this.internalPlugins.push(new p(this.element, pluginData));
      });
    }
    this.applyStretch(this.stretch);
    this.themeChanged(this.theme);
    this.columnChanged(this.columns);
    this.dataSourceChanged(this.source, undefined, 'source');
    this.dataSourceChanged(this.pinnedTopSource, undefined, 'pinnedTopSource');
    this.dataSourceChanged(this.pinnedBottomSource, undefined, 'pinnedBottomSource');
    this.trimmedRowsChanged(this.trimmedRows);
    this.rowDefChanged(this.rowDefinitions);
    this.groupingChanged(this.grouping);
    this.scrollingService = new GridScrollingService((e) => {
      this.dimensionProvider.setViewPortCoordinate({
        coordinate: e.coordinate,
        type: e.dimension,
      });
      this.viewportscroll.emit(e);
    });
  }
  disconnectedCallback() {
    // destroy plugins on element disconnect
    index.each(this.internalPlugins, p => p.destroy());
    this.internalPlugins = [];
  }
  render() {
    const contentHeight = this.dimensionProvider.stores['rgRow'].store.get('realSize');
    this.viewport = new ViewportService({
      columnProvider: this.columnProvider,
      dataProvider: this.dataProvider,
      dimensionProvider: this.dimensionProvider,
      viewportProvider: this.viewportProvider,
      uuid: this.uuid,
      scrollingService: this.scrollingService,
      orderService: this.orderService,
      selectionStoreConnector: this.selectionStoreConnector,
      resize: c => this.aftercolumnresize.emit(c),
    }, contentHeight);
    const views = [];
    if (this.rowHeaders && this.viewport.columns.length) {
      const anyView = this.viewport.columns[0];
      views.push(index$1.h("revogr-row-headers", { additionalData: this.additionalData, height: contentHeight, rowClass: this.rowClass, resize: this.resize, dataPorts: anyView.dataPorts, headerProp: anyView.headerProp, uiid: anyView.prop[index.UUID], rowHeaderColumn: typeof this.rowHeaders === 'object' ? this.rowHeaders : undefined, onScrollViewport: ({ detail: e }) => this.scrollingService.scrollService(e, 'headerRow'), onElementToScroll: ({ detail: e }) => this.scrollingService.registerElement(e, 'headerRow') }));
    }
    views.push(index$1.h(ViewPortSections, { additionalData: this.additionalData, columnFilter: !!this.filter, resize: this.resize, readonly: this.readonly, range: this.range, rowClass: this.rowClass, editors: this.editors, applyEditorChangesOnClose: this.applyOnClose, useClipboard: this.useClipboard, columns: this.viewport.columns, onSelectAll: () => {
        this.selectionStoreConnector.selectAll();
      }, onEdit: detail => {
        const event = this.beforeeditstart.emit(detail);
        if (!event.defaultPrevented) {
          this.selectionStoreConnector.setEdit(detail.val);
        }
      }, onCancelEdit: () => {
        this.selectionStoreConnector.setEdit(false);
      }, registerElement: (e, k) => this.scrollingService.registerElement(e, k), scrollSection: (details, k) => this.scrollingService.scrollService(details, k), scrollSectionSilent: (details, k) => this.scrollingService.scrollSilentService(details, k), focusTemplate: this.focusTemplate }));
    return (index$1.h(index$1.Host, Object.assign({}, { [`${index.UUID}`]: this.uuid }), index$1.h(RevoViewPort, { viewports: this.viewportProvider.stores, dimensions: this.dimensionProvider.stores, orderRef: e => (this.orderService = e), registerElement: (e, k) => this.scrollingService.registerElement(e, k), nakedClick: () => this.viewport.clearEdit(), onScroll: details => this.scrollingService.scrollService(details) }, index$1.h("slot", { name: 'viewport' }), views), this.extraElements));
  }
  get element() { return index$1.getElement(this); }
  static get watchers() { return {
    "columnTypes": ["columnTypesChanged"],
    "columns": ["columnChanged"],
    "rowSize": ["rowSizeChanged"],
    "theme": ["themeChanged"],
    "source": ["dataSourceChanged"],
    "pinnedBottomSource": ["dataSourceChanged"],
    "pinnedTopSource": ["dataSourceChanged"],
    "rowDefinitions": ["rowDefChanged"],
    "trimmedRows": ["trimmedRowsChanged"],
    "grouping": ["groupingChanged"],
    "stretch": ["applyStretch"],
    "filter": ["applyFilter"],
    "rowHeaders": ["rowHeadersChange"]
  }; }
};
RevoGridComponent.style = revoGridStyleCss;

exports.revo_grid = RevoGridComponent;

//# sourceMappingURL=revo-grid.cjs.entry.js.map