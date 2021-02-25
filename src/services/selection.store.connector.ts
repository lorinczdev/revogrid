import { Edition, Selection } from '../interfaces';
import { cropCellToMax, nextCell } from '../store/selection/selection.helpers';
import { SelectionStore } from '../store/selection/selection.store';

import Cell = Selection.Cell;
import EditCellStore = Edition.EditCellStore;

type StoresMatrix = { [y: number]: { [x: number]: SelectionStore } };
type StoreByDimension = Record<number, SelectionStore>;

export default class SelectionStoreConnector {
  // dirty flag required to cleanup whole store in case visibility of panels changed
  private dirty = false;
  private readonly stores: StoresMatrix = {};

  readonly columnStores: StoreByDimension = {};
  readonly rowStores: { [y: number]: SelectionStore } = {};

  get focusedStore(): SelectionStore | null {
    for (let y in this.stores) {
      for (let x in this.stores[y]) {
        if (this.stores[y][x].store.get('focus')) {
          return this.stores[y][x];
        }
      }
    }
    return null;
  }

  // check if require to cleanup all stores
  beforeUpdate() {
    if (this.dirty) {
      for (let y in this.stores) {
        for (let x in this.stores[y]) {
          this.unregister(this.stores[y][x]);
        }
      }
      this.dirty = false;
    }
  }

  registerColumn(x: number): SelectionStore {
    if (this.columnStores[x]) {
      return this.columnStores[x];
    }
    this.columnStores[x] = new SelectionStore();
    return this.columnStores[x];
  }

  registerRow(y: number): SelectionStore {
    if (this.rowStores[y]) {
      return this.rowStores[y];
    }
    this.rowStores[y] = new SelectionStore();
    return this.rowStores[y];
  }

  /**
   * Cross store proxy, based on multiple dimensions
   */
  register({ x, y }: Selection.Cell): SelectionStore {
    if (!this.stores[y]) {
      this.stores[y] = {};
    }
    if (this.stores[y][x]) {
      // Store already registered. Do not register twice
      return this.stores[y][x];
    }
    this.stores[y][x] = new SelectionStore();
    // proxy update
    this.stores[y][x]?.onChange('range', c => {
      this.columnStores[x].setRangeArea(c);
      this.rowStores[y].setRangeArea(c);
    });
    // clean up on remove
    this.stores[y][x]?.store.on('dispose', () => {
      this.columnStores[x]?.dispose();
      this.rowStores[y]?.dispose();
      delete this.rowStores[y];
      delete this.columnStores[x];
      delete this.stores[y][x];
      if (!Object.keys(this.stores[y] || {}).length) {
        delete this.stores[y];
      }
      this.dirty = true;
    });
    return this.stores[y][x];
  }

  setEditByCell({ x, y }: Selection.Cell, editCell: Selection.Cell): void {
    const store = this.stores[y][x];
    this.focus(store, { focus: editCell, end: editCell });
    this.setEdit('');
  }

  focus(store: SelectionStore, { focus, end }: { focus: Cell; end: Cell }) {
    let currentStorePointer: Selection.Cell;
    // clear all stores focus leave only active one
    for (let y in this.stores) {
      for (let x in this.stores[y]) {
        const s = this.stores[y][x];
        if (s !== store) {
          s.clearFocus();
        } else {
          currentStorePointer = { x: parseInt(x, 10), y: parseInt(y, 10) };
        }
      }
    }
    if (!currentStorePointer) {
      return;
    }

    // check is focus in next store
    const lastCell: Cell = store.store.get('lastCell');
    // item in new store
    const nextItem: Partial<Cell> | null = nextCell(focus, lastCell);

    let nextStore;
    if (nextItem) {
      for (let i in nextItem) {
        let type: keyof Cell = i as keyof Cell;
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
        } else {
          nextStore = stores[--currentStorePointer[type]];
          const nextLastCell = nextStore?.store.get('lastCell');
          if (nextLastCell) {
            nextItem[type] = nextLastCell[type] + nextItem[type];
          }
        }
      }
    }

    // if next store present - update
    if (nextStore) {
      let item = { ...focus, ...nextItem };
      this.focus(nextStore, { focus: item, end: item });
      return;
    }

    focus = cropCellToMax(focus, lastCell);
    end = cropCellToMax(focus, lastCell);

    store.setFocus(focus, end);
  }

  clearAll(): void {
    for (let y in this.stores) {
      for (let x in this.stores[y]) {
        this.stores[y][x]?.clearFocus();
      }
    }
  }

  get edit(): EditCellStore | undefined {
    return this.focusedStore?.store.get('edit');
  }

  get focused(): Cell | undefined {
    return this.focusedStore?.store.get('focus');
  }

  setEdit(val: string | boolean): void {
    if (!this.focusedStore) {
      return;
    }
    this.focusedStore.setEdit(val);
  }

  unregister(store: SelectionStore) {
    store.dispose();
  }

  private getXStores(y: number): { [p: number]: SelectionStore } {
    return this.stores[y];
  }

  private getYStores(x: number): { [p: number]: SelectionStore } {
    const stores: { [p: number]: SelectionStore } = {};
    for (let i in this.stores) {
      stores[i] = this.stores[i][x];
    }
    return stores;
  }
}
