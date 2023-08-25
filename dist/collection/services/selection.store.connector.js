/*!
 * Built by Revolist
 */
import { cropCellToMax, isHiddenStore, nextCell } from "../store/selection/selection.helpers";
import { SelectionStore } from "../store/selection/selection.store";
export const EMPTY_INDEX = -1;
export default class SelectionStoreConnector {
  constructor() {
    // dirty flag required to cleanup whole store in case visibility of panels changed
    this.dirty = false;
    this.stores = {};
    this.columnStores = {};
    this.rowStores = {};
    /**
     * Helpers for data conversion
     */
    this.storesByType = {};
    this.storesXToType = {};
    this.storesYToType = {};
    this.sections = [];
  }
  get focusedStore() {
    var _a;
    for (let y in this.stores) {
      for (let x in this.stores[y]) {
        const focused = (_a = this.stores[y][x]) === null || _a === void 0 ? void 0 : _a.store.get('focus');
        if (focused) {
          return {
            entity: this.stores[y][x],
            cell: focused,
            position: {
              x: parseInt(x, 10),
              y: parseInt(y, 10),
            },
          };
        }
      }
    }
    return null;
  }
  get edit() {
    var _a;
    return (_a = this.focusedStore) === null || _a === void 0 ? void 0 : _a.entity.store.get('edit');
  }
  get focused() {
    var _a;
    return (_a = this.focusedStore) === null || _a === void 0 ? void 0 : _a.entity.store.get('focus');
  }
  get selectedRange() {
    var _a;
    return (_a = this.focusedStore) === null || _a === void 0 ? void 0 : _a.entity.store.get('range');
  }
  registerSection(e) {
    if (!e) {
      this.sections.length = 0;
      // some elements removed, rebuild stores
      this.dirty = true;
      return;
    }
    if (this.sections.indexOf(e) === -1) {
      this.sections.push(e);
    }
  }
  // check if require to cleanup all stores
  beforeUpdate() {
    if (this.dirty) {
      for (let y in this.stores) {
        for (let x in this.stores[y]) {
          this.stores[y][x].dispose();
        }
      }
      this.dirty = false;
    }
  }
  registerColumn(x, type) {
    // if hidden just create store but no operations needed
    if (isHiddenStore(x)) {
      return new SelectionStore();
    }
    if (this.columnStores[x]) {
      return this.columnStores[x];
    }
    this.columnStores[x] = new SelectionStore();
    // build cross linking type to position
    this.storesByType[type] = x;
    this.storesXToType[x] = type;
    return this.columnStores[x];
  }
  registerRow(y, type) {
    // if hidden just create store
    if (isHiddenStore(y)) {
      return new SelectionStore();
    }
    if (this.rowStores[y]) {
      return this.rowStores[y];
    }
    this.rowStores[y] = new SelectionStore();
    // build cross linking type to position
    this.storesByType[type] = y;
    this.storesYToType[y] = type;
    return this.rowStores[y];
  }
  /**
   * Cross store proxy, based on multiple dimensions
   */
  register({ x, y }) {
    var _a, _b;
    // if hidden just create store
    if (isHiddenStore(x) || isHiddenStore(y)) {
      return new SelectionStore();
    }
    if (!this.stores[y]) {
      this.stores[y] = {};
    }
    if (this.stores[y][x]) {
      // Store already registered. Do not register twice
      return this.stores[y][x];
    }
    this.stores[y][x] = new SelectionStore();
    // proxy update, column store trigger only range area
    (_a = this.stores[y][x]) === null || _a === void 0 ? void 0 : _a.onChange('range', c => {
      this.columnStores[x].setRangeArea(c);
      this.rowStores[y].setRangeArea(c);
    });
    // clean up on remove
    (_b = this.stores[y][x]) === null || _b === void 0 ? void 0 : _b.store.on('dispose', () => this.destroy(x, y));
    return this.stores[y][x];
  }
  destroy(x, y) {
    var _a, _b;
    (_a = this.columnStores[x]) === null || _a === void 0 ? void 0 : _a.dispose();
    (_b = this.rowStores[y]) === null || _b === void 0 ? void 0 : _b.dispose();
    delete this.rowStores[y];
    delete this.columnStores[x];
    // clear x cross link
    if (this.storesXToType[x]) {
      const type = this.storesXToType[x];
      delete this.storesXToType[x];
      delete this.storesByType[type];
    }
    // clear y cross link
    if (this.storesYToType[y]) {
      const type = this.storesYToType[y];
      delete this.storesYToType[y];
      delete this.storesByType[type];
    }
    if (this.stores[y]) {
      delete this.stores[y][x];
    }
    // clear empty rows
    if (!Object.keys(this.stores[y] || {}).length) {
      delete this.stores[y];
    }
  }
  setEditByCell(storePos, editCell) {
    this.focusByCell(storePos, editCell, editCell);
    this.setEdit('');
  }
  focusByCell(storePos, start, end) {
    const store = this.stores[storePos.y][storePos.x];
    this.focus(store, { focus: start, end });
  }
  focus(store, { focus, end }) {
    let currentStorePointer;
    // clear all stores focus leave only active one
    for (let y in this.stores) {
      for (let x in this.stores[y]) {
        const s = this.stores[y][x];
        // clear other stores, only one area can be selected
        if (s !== store) {
          s.clearFocus();
        }
        else {
          currentStorePointer = { x: parseInt(x, 10), y: parseInt(y, 10) };
        }
      }
    }
    if (!currentStorePointer) {
      return null;
    }
    // check is focus in next store
    const lastCell = store.store.get('lastCell');
    // item in new store
    const nextItem = nextCell(focus, lastCell);
    let nextStore;
    if (nextItem) {
      for (let i in nextItem) {
        let type = i;
        let stores;
        switch (type) {
          case 'x':
            stores = this.getXStores(currentStorePointer.y);
            break;
          case 'y':
            stores = this.getYStores(currentStorePointer.x);
            break;
        }
        if (nextItem[type] >= 0) {
          nextStore = stores[++currentStorePointer[type]];
        }
        else {
          nextStore = stores[--currentStorePointer[type]];
          const nextLastCell = nextStore === null || nextStore === void 0 ? void 0 : nextStore.store.get('lastCell');
          if (nextLastCell) {
            nextItem[type] = nextLastCell[type] + nextItem[type];
          }
        }
      }
    }
    // if next store present - update
    if (nextStore) {
      let item = Object.assign(Object.assign({}, focus), nextItem);
      this.focus(nextStore, { focus: item, end: item });
      return null;
    }
    focus = cropCellToMax(focus, lastCell);
    end = cropCellToMax(end, lastCell);
    store.setFocus(focus, end);
    return focus;
  }
  clearAll() {
    var _a;
    for (let y in this.stores) {
      for (let x in this.stores[y]) {
        (_a = this.stores[y][x]) === null || _a === void 0 ? void 0 : _a.clearFocus();
      }
    }
  }
  setEdit(val) {
    if (!this.focusedStore) {
      return;
    }
    this.focusedStore.entity.setEdit(val);
  }
  /**
   * Select all cells across all stores
   */
  selectAll() {
    for (let y in this.stores) {
      for (let x in this.stores[y]) {
        const store = this.stores[y][x];
        if (!store) {
          continue;
        }
        const lastCell = store.store.get('lastCell');
        store.setRange({ x: 0, y: 0 }, { x: lastCell.x - 1, y: lastCell.y - 1 });
      }
    }
  }
  getXStores(y) {
    return this.stores[y];
  }
  getYStores(x) {
    const stores = {};
    for (let i in this.stores) {
      stores[i] = this.stores[i][x];
    }
    return stores;
  }
}
//# sourceMappingURL=selection.store.connector.js.map
