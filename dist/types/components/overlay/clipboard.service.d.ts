import SelectionStoreService from '../../store/selection/selection.store.service';
import { Observable, RevoGrid, Selection } from '../../interfaces';
import ColumnService from '../data/columnService';
import { DataSourceState } from '../../store/dataSource/data.store';
type Config = {
  selectionStoreService: SelectionStoreService;
  columnService: ColumnService;
  dataStore: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
  rangeApply(data: RevoGrid.DataLookup, range: Selection.RangeArea): void;
  rangeCopy(range: Selection.RangeArea): any;
  rangeClear(): void;
  beforeCopy(range: Selection.RangeArea): CustomEvent;
  beforePaste(data: RevoGrid.DataLookup, range: Selection.RangeArea): CustomEvent;
};
export declare class ClipboardService {
  private sv;
  private clipboard;
  constructor(sv: Config);
  renderClipboard(readonly?: boolean): any;
  private getRegion;
  private onCopy;
  private onPaste;
}
export {};
