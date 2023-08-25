import { Observable, Selection } from '../../interfaces';
import SelectionStoreService from '../../store/selection/selection.store.service';
type Config = {
  selectionStoreService: SelectionStoreService;
  selectionStore: Observable<Selection.SelectionStoreState>;
  applyEdit(val?: any): void;
  cancelEdit(): void;
  clearCell(): void;
  focusNext(focus: Selection.Cell, next: Partial<Selection.Cell>): boolean;
  getData(): any;
  internalPaste(): void;
  range(range: Selection.RangeArea): boolean;
  selectAll(): void;
};
export declare class KeyboardService {
  private sv;
  constructor(sv: Config);
  keyDown(e: KeyboardEvent, canRange: boolean): Promise<void>;
  private selectAll;
  keyChangeSelection(e: KeyboardEvent, canRange: boolean): Promise<boolean>;
  keyPositionChange(changes: Partial<Selection.Cell>, range?: Selection.RangeArea, focus?: Selection.Cell, isMulti?: boolean): boolean;
  /** Monitor key direction changes */
  changeDirectionKey(e: KeyboardEvent, canRange: boolean): {
    changes: Partial<Selection.Cell>;
    isMulti?: boolean;
  } | void;
}
export {};
