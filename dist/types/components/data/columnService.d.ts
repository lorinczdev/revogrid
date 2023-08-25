import { DataSourceState } from '../../store/dataSource/data.store';
import { Edition, Observable, RevoGrid, Selection } from '../../interfaces';
export type ColumnSource<T = RevoGrid.ColumnRegular> = Observable<DataSourceState<T, RevoGrid.DimensionCols>>;
export type RowSource = Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
export type ColumnStores = {
  [T in RevoGrid.DimensionCols]: ColumnSource;
};
export type RowStores = {
  [T in RevoGrid.DimensionRows]: RowSource;
};
export default class ColumnService {
  private dataStore;
  private source;
  private unsubscribe;
  get columns(): RevoGrid.ColumnRegular[];
  hasGrouping: boolean;
  type: RevoGrid.DimensionCols;
  constructor(dataStore: RowSource, source: ColumnSource);
  private checkGrouping;
  isReadOnly(r: number, c: number): boolean;
  static doMerge(existing: RevoGrid.CellProps, extra: RevoGrid.CellProps): RevoGrid.CellProps;
  mergeProperties(r: number, c: number, defaultProps: RevoGrid.CellProps): RevoGrid.CellProps;
  getRowClass(r: number, prop: string): string;
  getCellData(r: number, c: number): string;
  getSaveData(rowIndex: number, colIndex: number, val?: string): Edition.BeforeSaveDataDetails;
  getCellEditor(_r: number, c: number, editors: Edition.Editors): Edition.EditorCtr | undefined;
  rowDataModel(rowIndex: number, colIndex: number): RevoGrid.ColumnDataSchemaModel;
  getRangeData(d: Selection.ChangedRange, columns: RevoGrid.ColumnRegular[]): {
    changed: RevoGrid.DataLookup;
    mapping: Selection.OldNewRangeMapping;
  };
  getTransformedDataToApply(start: Selection.Cell, data: RevoGrid.DataFormat[][]): {
    changed: RevoGrid.DataLookup;
    range: Selection.RangeArea;
  };
  applyRangeData(data: RevoGrid.DataLookup): void;
  getRangeStaticData(d: Selection.RangeArea, value: RevoGrid.DataFormat): RevoGrid.DataLookup;
  getRangeTransformedToProps(d: Selection.RangeArea, store: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>): {
    prop: RevoGrid.ColumnProp;
    rowIndex: number;
    colIndex: number;
    model: RevoGrid.DataSource;
    colType: RevoGrid.DimensionCols;
    type: RevoGrid.DimensionRows;
  }[];
  copyRangeArray(range: Selection.RangeArea, store: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>): {
    data: any[][];
    mapping: {
      [rowIndex: number]: {
        [colProp: string]: any;
        [colProp: number]: any;
      };
    };
  };
  static getData(val?: any): any;
  destroy(): void;
}
