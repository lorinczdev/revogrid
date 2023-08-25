/*!
 * Built by Revolist
 */
import { h as getVisibleSourceItem, H as CELL_CLASS, I as DISABLED_CLASS, g as getSourceItem, s as setSourceByVirtualIndex, J as scaleValue } from './index-a937c03b.js';
import { k as isGroupingColumn, l as lodash, n as getRange } from './viewport.helpers-b34b34b0.js';

class ColumnService {
  get columns() {
    return getVisibleSourceItem(this.source);
  }
  constructor(dataStore, source) {
    this.dataStore = dataStore;
    this.source = source;
    this.unsubscribe = [];
    this.hasGrouping = false;
    this.unsubscribe.push(source.onChange('source', s => this.checkGrouping(s)));
    this.checkGrouping(source.get('source'));
    this.type = source.get('type');
  }
  checkGrouping(cols) {
    for (let rgCol of cols) {
      if (isGroupingColumn(rgCol)) {
        this.hasGrouping = true;
        return;
      }
      this.hasGrouping = false;
    }
  }
  isReadOnly(r, c) {
    var _a;
    const readOnly = (_a = this.columns[c]) === null || _a === void 0 ? void 0 : _a.readonly;
    if (typeof readOnly === 'function') {
      const data = this.rowDataModel(r, c);
      return readOnly(data);
    }
    return readOnly;
  }
  static doMerge(existing, extra) {
    let props = Object.assign(Object.assign({}, extra), existing);
    // extend existing props
    if (extra.class) {
      if (typeof extra.class === 'object' && typeof props.class === 'object') {
        props.class = Object.assign(Object.assign({}, extra.class), props.class);
      }
      else if (typeof extra.class === 'string' && typeof props.class === 'object') {
        props.class[extra.class] = true;
      }
      else if (typeof props.class === 'string') {
        props.class += ' ' + extra.class;
      }
    }
    if (extra.style) {
      props.style = Object.assign(Object.assign({}, extra.style), props.style);
    }
    return props;
  }
  mergeProperties(r, c, defaultProps) {
    var _a;
    const cellClass = {
      [CELL_CLASS]: true,
      [DISABLED_CLASS]: this.isReadOnly(r, c),
    };
    let props = Object.assign(Object.assign({}, defaultProps), { class: cellClass });
    const extraPropsFunc = (_a = this.columns[c]) === null || _a === void 0 ? void 0 : _a.cellProperties;
    if (extraPropsFunc) {
      const data = this.rowDataModel(r, c);
      const extra = extraPropsFunc(data);
      if (!extra) {
        return props;
      }
      return ColumnService.doMerge(props, extra);
    }
    return props;
  }
  getRowClass(r, prop) {
    const model = getSourceItem(this.dataStore, r) || {};
    return model[prop] || '';
  }
  getCellData(r, c) {
    const data = this.rowDataModel(r, c);
    return ColumnService.getData(data.model[data.prop]);
  }
  getSaveData(rowIndex, colIndex, val) {
    if (typeof val === 'undefined') {
      val = this.getCellData(rowIndex, colIndex);
    }
    const data = this.rowDataModel(rowIndex, colIndex);
    return {
      prop: data.prop,
      rowIndex,
      colIndex,
      val,
      model: data.model,
      colType: this.type,
      type: this.dataStore.get('type'),
    };
  }
  getCellEditor(_r, c, editors) {
    var _a;
    const editor = (_a = this.columns[c]) === null || _a === void 0 ? void 0 : _a.editor;
    if (!editor) {
      return undefined;
    }
    // reference
    if (typeof editor === 'string') {
      return editors[editor];
    }
    return editor;
  }
  rowDataModel(rowIndex, colIndex) {
    const column = this.columns[colIndex];
    const prop = column === null || column === void 0 ? void 0 : column.prop;
    const model = getSourceItem(this.dataStore, rowIndex) || {};
    const type = this.dataStore.get('type');
    return {
      prop,
      model,
      data: this.dataStore.get('source'),
      column,
      rowIndex,
      colIndex,
      colType: this.type,
      type,
    };
  }
  getRangeData(d, columns) {
    var _a;
    const changed = {};
    // get original length sizes
    const copyColLength = d.oldRange.x1 - d.oldRange.x + 1;
    const copyRowLength = d.oldRange.y1 - d.oldRange.y + 1;
    const mapping = {};
    // rows
    for (let rowIndex = d.newRange.y, i = 0; rowIndex < d.newRange.y1 + 1; rowIndex++, i++) {
      // copy original data link
      const oldRowIndex = d.oldRange.y + i % copyRowLength;
      const copyRow = getSourceItem(this.dataStore, oldRowIndex) || {};
      // columns
      for (let colIndex = d.newRange.x, j = 0; colIndex < d.newRange.x1 + 1; colIndex++, j++) {
        // check if old range area
        if (rowIndex >= d.oldRange.y && rowIndex <= d.oldRange.y1 && colIndex >= d.oldRange.x && colIndex <= d.oldRange.x1) {
          continue;
        }
        // requested column beyond range
        if (!this.columns[colIndex]) {
          continue;
        }
        const prop = (_a = this.columns[colIndex]) === null || _a === void 0 ? void 0 : _a.prop;
        const copyColIndex = d.oldRange.x + j % copyColLength;
        const copyColumnProp = columns[copyColIndex].prop;
        /** if can write */
        if (!this.isReadOnly(rowIndex, colIndex)) {
          /** to show before save */
          if (!changed[rowIndex]) {
            changed[rowIndex] = {};
          }
          changed[rowIndex][prop] = copyRow[copyColumnProp];
          /** Generate mapping object */
          if (!mapping[rowIndex]) {
            mapping[rowIndex] = {};
          }
          mapping[rowIndex][prop] = {
            colIndex: copyColIndex,
            colProp: copyColumnProp,
            rowIndex: oldRowIndex
          };
        }
      }
    }
    return {
      changed,
      mapping,
    };
  }
  getTransformedDataToApply(start, data) {
    const changed = {};
    const copyRowLength = data.length;
    const colLength = this.columns.length;
    const rowLength = this.dataStore.get('items').length;
    // rows
    let rowIndex = start.y;
    let maxCol = 0;
    for (let i = 0; rowIndex < rowLength && i < copyRowLength; rowIndex++, i++) {
      // copy original data link
      const copyRow = data[i % copyRowLength];
      const copyColLength = (copyRow === null || copyRow === void 0 ? void 0 : copyRow.length) || 0;
      // columns
      let colIndex = start.x;
      for (let j = 0; colIndex < colLength && j < copyColLength; colIndex++, j++) {
        const p = this.columns[colIndex].prop;
        const currentCol = j % colLength;
        /** if can write */
        if (!this.isReadOnly(rowIndex, colIndex)) {
          /** to show before save */
          if (!changed[rowIndex]) {
            changed[rowIndex] = {};
          }
          changed[rowIndex][p] = copyRow[currentCol];
        }
      }
      maxCol = Math.max(maxCol, colIndex - 1);
    }
    const range = getRange(start, {
      y: rowIndex - 1,
      x: maxCol,
    });
    return {
      changed,
      range,
    };
  }
  applyRangeData(data) {
    const items = {};
    for (let rowIndex in data) {
      const oldModel = (items[rowIndex] = getSourceItem(this.dataStore, parseInt(rowIndex, 10)));
      if (!oldModel) {
        continue;
      }
      for (let prop in data[rowIndex]) {
        oldModel[prop] = data[rowIndex][prop];
      }
    }
    setSourceByVirtualIndex(this.dataStore, items);
  }
  getRangeStaticData(d, value) {
    const changed = {};
    // rows
    for (let rowIndex = d.y, i = 0; rowIndex < d.y1 + 1; rowIndex++, i++) {
      // columns
      for (let colIndex = d.x, j = 0; colIndex < d.x1 + 1; colIndex++, j++) {
        // requested column beyond range
        if (!this.columns[colIndex]) {
          continue;
        }
        const p = this.columns[colIndex].prop;
        /** if can write */
        if (!this.isReadOnly(rowIndex, colIndex)) {
          /** to show before save */
          if (!changed[rowIndex]) {
            changed[rowIndex] = {};
          }
          changed[rowIndex][p] = value;
        }
      }
    }
    return changed;
  }
  getRangeTransformedToProps(d, store) {
    var _a;
    const area = [];
    const type = this.dataStore.get('type');
    // rows
    for (let rowIndex = d.y, i = 0; rowIndex < d.y1 + 1; rowIndex++, i++) {
      // columns
      for (let colIndex = d.x, j = 0; colIndex < d.x1 + 1; colIndex++, j++) {
        const prop = (_a = this.columns[colIndex]) === null || _a === void 0 ? void 0 : _a.prop;
        area.push({
          prop,
          rowIndex,
          colIndex,
          model: getSourceItem(store, rowIndex),
          type,
          colType: this.type,
        });
      }
    }
    return area;
  }
  copyRangeArray(range, store) {
    const cols = [...this.columns];
    const props = lodash.slice(cols, range.x, range.x1 + 1).map(v => v.prop);
    const toCopy = [];
    const mapping = {};
    // rows indexes
    for (let i = range.y; i <= range.y1; i++) {
      const rgRow = [];
      mapping[i] = {};
      // columns indexes
      for (let prop of props) {
        const item = getSourceItem(store, i);
        // if no item - skip
        if (!item) {
          continue;
        }
        const val = item[prop];
        rgRow.push(val);
        mapping[i][prop] = val;
      }
      toCopy.push(rgRow);
    }
    return {
      data: toCopy,
      mapping
    };
  }
  static getData(val) {
    if (typeof val === 'undefined' || val === null) {
      return '';
    }
    return val;
  }
  destroy() {
    this.unsubscribe.forEach(f => f());
  }
}

const initialParams = {
  contentSize: 0,
  clientSize: 0,
  virtualSize: 0,
  maxSize: 0,
};
const NO_COORDINATE = -1;
class LocalScrollService {
  constructor(cfg) {
    this.cfg = cfg;
    this.preventArtificialScroll = { rgRow: null, rgCol: null };
    // to check if scroll changed
    this.previousScroll = { rgRow: NO_COORDINATE, rgCol: NO_COORDINATE };
    this.params = { rgRow: Object.assign({}, initialParams), rgCol: Object.assign({}, initialParams) };
  }
  static getVirtualContentSize(contentSize, clientSize, virtualSize = 0) {
    return contentSize + (virtualSize ? clientSize - virtualSize : 0);
  }
  setParams(params, dimension) {
    const virtualContentSize = LocalScrollService.getVirtualContentSize(params.contentSize, params.clientSize, params.virtualSize);
    this.params[dimension] = Object.assign(Object.assign({}, params), { maxSize: virtualContentSize - params.clientSize, virtualContentSize });
  }
  // apply scroll values after scroll done
  async setScroll(e) {
    this.cancelScroll(e.dimension);
    const frameAnimation = new Promise((resolve, reject) => {
      // for example safari desktop has issues with animation frame
      if (this.cfg.skipAnimationFrame) {
        return resolve();
      }
      const animationId = window.requestAnimationFrame(() => {
        resolve();
      });
      this.preventArtificialScroll[e.dimension] = reject.bind(null, animationId);
    });
    try {
      await frameAnimation;
      const params = this.getParams(e.dimension);
      e.coordinate = Math.ceil(e.coordinate);
      this.previousScroll[e.dimension] = this.wrapCoordinate(e.coordinate, params);
      this.preventArtificialScroll[e.dimension] = null;
      this.cfg.afterScroll(Object.assign(Object.assign({}, e), { coordinate: params.virtualSize ? this.convert(e.coordinate, params, false) : e.coordinate }));
    }
    catch (id) {
      window.cancelAnimationFrame(id);
    }
  }
  // initiate scrolling event
  scroll(coordinate, dimension, force = false, delta, outside = false) {
    this.cancelScroll(dimension);
    if (!force && this.previousScroll[dimension] === coordinate) {
      this.previousScroll[dimension] = NO_COORDINATE;
      return;
    }
    const param = this.getParams(dimension);
    this.cfg.beforeScroll({
      dimension: dimension,
      coordinate: param.virtualSize ? this.convert(coordinate, param) : coordinate,
      delta,
      outside
    });
  }
  getParams(dimension) {
    return this.params[dimension];
  }
  // check if scroll outside of region to avoid looping
  wrapCoordinate(c, param) {
    if (c < 0) {
      return NO_COORDINATE;
    }
    if (c > param.maxSize) {
      return param.maxSize;
    }
    return c;
  }
  // prevent already started scroll, performance optimization
  cancelScroll(dimension) {
    const canceler = this.preventArtificialScroll[dimension];
    if (canceler) {
      canceler();
      this.preventArtificialScroll[dimension] = null;
    }
  }
  /* convert virtual to real and back, scale range */
  convert(pos, param, toReal = true) {
    const minRange = param.clientSize;
    const from = [0, param.virtualContentSize - minRange];
    const to = [0, param.contentSize - param.virtualSize];
    if (toReal) {
      return scaleValue(pos, from, to);
    }
    return scaleValue(pos, to, from);
  }
}

export { ColumnService as C, LocalScrollService as L };

//# sourceMappingURL=localScrollService-9c3949fd.js.map