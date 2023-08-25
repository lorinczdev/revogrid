import { RevoGrid } from '../../interfaces';
import BasePlugin from '../basePlugin';
export type SortingOrder = Record<RevoGrid.ColumnProp, RevoGrid.Order>;
type SortingOrderFunction = Record<RevoGrid.ColumnProp, RevoGrid.CellCompareFunc | undefined>;
/**
 * lifecycle
 * 1) @event beforesorting - sorting just started, nothing happened yet, can be from column or from source, if type is from rows - column will be undefined
 * 2) @metod updateColumnSorting - column sorting icon applied to grid and column get updated, data still untiuched
 * 3) @event beforesortingapply - before we applied sorting data to data source, you can prevent event and data will not be sorted. It's called only from column sorting click
 * 4) @event afterSortingApply - sorting applied, just finished event, from rows and columns
 *
 * If you prevent event it'll not reach farther steps
 */
export default class SortingPlugin extends BasePlugin {
  protected revogrid: HTMLRevoGridElement;
  private sorting;
  private sortingFunc;
  private doSort;
  constructor(revogrid: HTMLRevoGridElement);
  private getComparer;
  /**
   * Apply sorting to data on header click
   * If additive - add to existing sorting, multiple columns can be sorted
   */
  headerclick(column: RevoGrid.ColumnRegular, index: number, additive: boolean): Promise<void>;
  /**
   * Sort items by sorting function
   * @requires proxyItems applied to row store
   * @requires source applied to row store
   *
   * @param sorting - per column sorting
   * @param data - this.stores['rgRow'].store.get('source')
   */
  sort(sorting: SortingOrder, sortingFunc: SortingOrderFunction, types?: RevoGrid.DimensionRows[]): Promise<void>;
  defaultCellCompare(prop: RevoGrid.ColumnProp, a: RevoGrid.DataType, b: RevoGrid.DataType): 0 | 1 | -1;
  descCellCompare(cmp: RevoGrid.CellCompareFunc): (prop: RevoGrid.ColumnProp, a: RevoGrid.DataType, b: RevoGrid.DataType) => number;
  sortIndexByItems(indexes: number[], source: RevoGrid.DataType[], sortingFunc: SortingOrderFunction): number[];
  getNextOrder(currentOrder: RevoGrid.Order): RevoGrid.Order;
}
export {};
