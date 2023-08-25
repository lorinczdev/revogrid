import { RevoGrid, Selection } from '../../interfaces';
import DimensionProvider from '../../services/dimension.provider';
import SelectionStoreConnector from '../../services/selection.store.connector';
import ViewportProvider from '../../services/viewport.provider';
import { OrdererService } from '../order/orderRenderer';
import GridScrollingService from './viewport.scrolling.service';
import { ViewportProps } from './viewport.interfaces';
import ColumnDataProvider from '../../services/column.data.provider';
import { DataProvider } from '../../services/data.provider';
export type ResizeDetails = {
  [index: number]: RevoGrid.ColumnRegular;
};
type Config = {
  columnProvider: ColumnDataProvider;
  dataProvider: DataProvider;
  dimensionProvider: DimensionProvider;
  viewportProvider: ViewportProvider;
  uuid: string | null;
  scrollingService: GridScrollingService;
  orderService: OrdererService;
  selectionStoreConnector: SelectionStoreConnector;
  resize(r: ResizeDetails): void;
};
export type FocusedData = {
  model: any;
  cell: Selection.Cell;
  colType: RevoGrid.DimensionCols;
  rowType: RevoGrid.DimensionRows;
  column?: RevoGrid.ColumnRegular;
};
export default class ViewportService {
  private sv;
  readonly columns: ViewportProps[];
  constructor(sv: Config, contentHeight: number);
  private onColumnResize;
  /**
   * Transform data from stores and apply it to different components
   * Handle columns
   */
  private getViewportColumnData;
  /** register selection store for Segment */
  private registerSegment;
  /** register selection store for Row */
  private registerRow;
  /** register selection store for Column */
  private registerCol;
  /** Collect Column data */
  private gatherColumnData;
  /** Collect Row data */
  private dataViewPort;
  private dataPartition;
  scrollToCell(cell: Partial<Selection.Cell>): void;
  /**
   * Clear current grid focus
   */
  clearFocused(): void;
  clearEdit(): void;
  /**
   * Collect focused element data
   */
  getFocused(): FocusedData | null;
  getStoreCoordinateByType(colType: RevoGrid.DimensionCols, rowType: RevoGrid.DimensionRows): {
    x: number;
    y: number;
  };
  setFocus(colType: string, rowType: string, start: Selection.Cell, end: Selection.Cell): void;
  getSelectedRange(): Selection.RangeArea | null;
  setEdit(rowIndex: number, colIndex: number, colType: RevoGrid.DimensionCols, rowType: RevoGrid.DimensionRows): void;
}
export {};
