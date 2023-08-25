import { Observable, Selection, RevoGrid, Edition } from '../../interfaces';
import { EventData } from './selection.utils';
import SelectionStoreService from '../../store/selection/selection.store.service';
import ColumnService from '../data/columnService';
import { DataSourceState } from '../../store/dataSource/data.store';
type Config = {
  selectionStoreService: SelectionStoreService;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  columnService: ColumnService;
  dataStore: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
  setTempRange(e: Selection.TempRange | null): Event;
  selectionChanged(e: Selection.ChangedRange): Event;
  rangeCopy(e: Selection.ChangedRange): Event;
  rangeDataApply(e: Edition.BeforeRangeSaveDataDetails): CustomEvent;
  setRange(e: Selection.RangeArea): boolean;
  clearRangeDataApply(e: {
    range: Selection.RangeArea;
  }): CustomEvent<{
    range: Selection.RangeArea;
  }>;
  getData(): any;
};
declare enum AutoFillType {
  selection = "Selection",
  autoFill = "AutoFill"
}
export declare class AutoFillService {
  private sv;
  private autoFillType;
  private autoFillInitial;
  private autoFillStart;
  private autoFillLast;
  private onMouseMoveAutofill;
  constructor(sv: Config);
  /**
   * Render autofill box
   * @param range
   * @param selectionFocus
   */
  renderAutofill(range: Selection.RangeArea, selectionFocus: Selection.Cell): any;
  private autoFillHandler;
  get isAutoFill(): boolean;
  /** Process mouse move events */
  selectionMouseMove(e: MouseEvent | TouchEvent): void;
  private getFocus;
  /**
   * Autofill logic:
   * on mouse move apply based on previous direction (if present)
   */
  private doAutofillMouseMove;
  /**
   * Range selection started
   * Mode @param type:
   * Can be triggered from MouseDown selection on element
   * Or can be triggered on corner square drag
   */
  selectionStart(target: Element, data: EventData, type?: AutoFillType): void;
  /**
   * Clear current range selection
   * on mouse up and mouse leave events
   */
  clearAutoFillSelection(): void;
  /** Trigger range apply events and handle responses */
  onRangeApply(data: RevoGrid.DataLookup, range: Selection.RangeArea): void;
  /** Apply range and copy data during range application */
  private applyRangeWithData;
  /**
   * Update range selection only,
   * no data change (mouse selection)
   */
  private applyRangeOnly;
}
export {};
