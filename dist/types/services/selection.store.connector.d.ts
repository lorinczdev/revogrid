import { Edition, Selection, RevoGrid } from '../interfaces';
import { SelectionStore } from '../store/selection/selection.store';
import Cell = Selection.Cell;
import EditCellStore = Edition.EditCellStore;
type StoreByDimension = Record<number, SelectionStore>;
type FocusedStore = {
  entity: SelectionStore;
  cell: Selection.Cell;
  position: Selection.Cell;
};
type StoresMapping<T> = {
  [xOrY: number]: Partial<T>;
};
export declare const EMPTY_INDEX = -1;
export default class SelectionStoreConnector {
  private dirty;
  readonly stores: {
    [y: number]: {
      [x: number]: SelectionStore;
    };
  };
  readonly columnStores: StoreByDimension;
  readonly rowStores: {
    [y: number]: SelectionStore;
  };
  /**
   * Helpers for data conversion
   */
  readonly storesByType: Partial<Record<RevoGrid.MultiDimensionType, number>>;
  readonly storesXToType: StoresMapping<RevoGrid.DimensionCols>;
  readonly storesYToType: StoresMapping<RevoGrid.DimensionRows>;
  get focusedStore(): FocusedStore | null;
  get edit(): EditCellStore | undefined;
  get focused(): Cell | undefined;
  get selectedRange(): Selection.RangeArea | undefined;
  private readonly sections;
  registerSection(e?: Element): void;
  beforeUpdate(): void;
  registerColumn(x: number, type: RevoGrid.DimensionCols): SelectionStore;
  registerRow(y: number, type: RevoGrid.DimensionRows): SelectionStore;
  /**
   * Cross store proxy, based on multiple dimensions
   */
  register({ x, y }: Selection.Cell): SelectionStore;
  private destroy;
  setEditByCell<T extends Selection.Cell>(storePos: T, editCell: T): void;
  focusByCell<T extends Selection.Cell>(storePos: T, start: T, end: T): void;
  focus(store: SelectionStore, { focus, end }: {
    focus: Cell;
    end: Cell;
  }): Selection.Cell;
  clearAll(): void;
  setEdit(val: string | boolean): void;
  /**
   * Select all cells across all stores
   */
  selectAll(): void;
  private getXStores;
  private getYStores;
}
export {};
