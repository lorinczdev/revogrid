import DataStore from '../store/dataSource/data.store';
import { RevoGrid } from '../interfaces';
import { ColumnGrouping } from '../plugins/groupingColumn/grouping.col.plugin';
export type ColumnCollection = {
  columns: Record<RevoGrid.DimensionCols, RevoGrid.ColumnRegular[]>;
  columnByProp: Record<RevoGrid.ColumnProp, RevoGrid.ColumnRegular[]>;
  columnGrouping: ColumnGrouping;
  maxLevel: number;
  sort: Record<RevoGrid.ColumnProp, RevoGrid.ColumnRegular>;
};
export type ColumnDataSources = Record<RevoGrid.DimensionCols, DataStore<RevoGrid.ColumnRegular, RevoGrid.DimensionCols>>;
type Sorting = Record<RevoGrid.ColumnProp, RevoGrid.ColumnRegular>;
type SortingOrder = Record<RevoGrid.ColumnProp, 'asc' | 'desc'>;
export default class ColumnDataProvider {
  readonly dataSources: ColumnDataSources;
  sorting: Sorting | null;
  get order(): SortingOrder;
  get stores(): ColumnDataSources;
  constructor();
  column(c: number, pin?: RevoGrid.DimensionColPin): RevoGrid.ColumnRegular | undefined;
  getColumn(virtualIndex: number, type: RevoGrid.DimensionCols): RevoGrid.ColumnRegular | undefined;
  getRawColumns(): Record<RevoGrid.DimensionCols, RevoGrid.ColumnRegular[]>;
  getColumns(type?: RevoGrid.DimensionCols | 'all'): RevoGrid.ColumnRegular[];
  getColumnIndexByProp(prop: RevoGrid.ColumnProp, type: RevoGrid.DimensionCols): number;
  getColumnByProp(prop: RevoGrid.ColumnProp, type: RevoGrid.DimensionCols): RevoGrid.ColumnRegular | undefined;
  refreshByType(type: RevoGrid.DimensionCols): void;
  setColumns(data: ColumnCollection): ColumnCollection;
  updateColumns(cols: RevoGrid.ColumnRegular[]): void;
  updateColumn(column: RevoGrid.ColumnRegular, index: number): void;
  updateColumnSorting(column: RevoGrid.ColumnRegular, index: number, sorting: 'asc' | 'desc', additive: boolean): RevoGrid.ColumnRegular;
  clearSorting(): void;
  static getSizes(cols: RevoGrid.ColumnRegular[]): RevoGrid.ViewSettingSizeProp;
  static getColumnByProp(columns: RevoGrid.ColumnData, prop: RevoGrid.ColumnProp): RevoGrid.ColumnRegular | undefined;
  static getColumns(columns: RevoGrid.ColumnData, level?: number, types?: RevoGrid.ColumnTypes): ColumnCollection;
  static getColumnType(rgCol: RevoGrid.ColumnRegular): RevoGrid.DimensionCols;
}
export {};
