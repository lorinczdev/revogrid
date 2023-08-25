import { EventEmitter } from '../../stencil-public-runtime';
import { AllDimensionType, ApplyFocusEvent, FocusRenderEvent, Edition, Observable, RevoGrid, Selection, DragStartEvent } from '../../interfaces';
import ColumnService from '../data/columnService';
import SelectionStoreService from '../../store/selection/selection.store.service';
import { DataSourceState } from '../../store/dataSource/data.store';
export declare class OverlaySelection {
  element: HTMLElement;
  /**
   * If readonly mode enables
   */
  readonly: boolean;
  /**
   * Range selection mode
   */
  range: boolean;
  /**
   * Enable revogr-order-editor component (read more in revogr-order-editor component)
   * Allows D&D
   */
  canDrag: boolean;
  /**
   * Enable revogr-clipboard component (read more in revogr-clipboard component)
   * Allows copy/paste
   */
  useClipboard: boolean;
  selectionStore: Observable<Selection.SelectionStoreState>;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  /**
   * Row data store
   */
  dataStore: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;
  /**
   * Column data store
   */
  colData: Observable<DataSourceState<RevoGrid.ColumnRegular, RevoGrid.DimensionCols>>;
  /**
   * Last cell position
   */
  lastCell: Selection.Cell;
  /**
   * Custom editors register
   */
  editors: Edition.Editors;
  /**
   * If true applys changes when cell closes if not Escape
   */
  applyChangesOnClose: boolean;
  /**
   * Additional data to pass to renderer
   */
  additionalData: any;
  /**
   * Is mobile view mode
   */
  isMobileDevice: boolean;
  /**
   * Before clipboard copy happened
   */
  internalCopy: EventEmitter;
  /**
   * Before paste happened
   */
  internalPaste: EventEmitter;
  internalCellEdit: EventEmitter<Edition.BeforeSaveDataDetails>;
  beforeFocusCell: EventEmitter<Edition.BeforeSaveDataDetails>;
  /**
   * Set edit cell
   */
  setEdit: EventEmitter<Edition.BeforeEdit>;
  beforeApplyRange: EventEmitter<FocusRenderEvent>;
  /**
   * Before range selection applied
   */
  beforeSetRange: EventEmitter;
  beforeEditRender: EventEmitter<FocusRenderEvent>;
  setRange: EventEmitter<Selection.RangeArea & {
    type: RevoGrid.MultiDimensionType;
  }>;
  selectAll: EventEmitter;
  /**
   * Used for editors support when close requested
   */
  cancelEdit: EventEmitter;
  setTempRange: EventEmitter<Selection.TempRange | null>;
  applyFocus: EventEmitter<FocusRenderEvent>;
  focusCell: EventEmitter<ApplyFocusEvent>;
  /** Range data apply */
  beforeRangeDataApply: EventEmitter<FocusRenderEvent>;
  /** Selection range changed */
  internalSelectionChanged: EventEmitter<Selection.ChangedRange>;
  /** Selection range changed */
  beforeRangeCopyApply: EventEmitter<Selection.ChangedRange>;
  /** Range data apply */
  internalRangeDataApply: EventEmitter<Edition.BeforeRangeSaveDataDetails>;
  /** Range copy */
  rangeClipboardCopy: EventEmitter;
  rangeClipboardPaste: EventEmitter;
  /**
   * Before key up event proxy, used to prevent key up trigger.
   * If you have some custom behaviour event, use this event to check if it wasn't processed by internal logic.
   * Call preventDefault()
   */
  beforeKeyDown: EventEmitter<KeyboardEvent>;
  /**
   * Before key down event proxy, used to prevent key down trigger.
   * If you have some custom behaviour event, use this event to check if it wasn't processed by internal logic.
   * Call preventDefault()
   */
  beforeKeyUp: EventEmitter<KeyboardEvent>;
  protected columnService: ColumnService;
  protected selectionStoreService: SelectionStoreService;
  private keyboardService;
  private autoFillService;
  private clipboardService;
  private orderEditor;
  private revogrEdit;
  /**
   * Runs before cell save
   * Can be used to override or cancel original save
   */
  beforeCellSave: EventEmitter;
  onMouseMove(e: MouseEvent | TouchEvent): void;
  /** Action finished inside of the document */
  /** Pointer left document, clear any active operation */
  onMouseUp(): void;
  /** Row drag started */
  onCellDrag(e: CustomEvent<DragStartEvent>): void;
  /** Get keyboard down from element */
  onKeyUp(e: KeyboardEvent): void;
  /** Get keyboard down from element */
  onKeyDown(e: KeyboardEvent): void;
  selectionServiceSet(s: Observable<Selection.SelectionStoreState>): void;
  createAutoFillService(): void;
  columnServiceSet(): void;
  createClipboardService(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  private renderRange;
  private renderEditCell;
  render(): any;
  private doFocus;
  private triggerRangeEvent;
  protected onElementMouseDown(e: MouseEvent | TouchEvent, touch?: boolean): void;
  /**
   * Start cell editing
   */
  protected doEdit(val?: string): void;
  /**
   * Close editor event triggered
   * @param details - if requires focus next
   */
  private closeEdit;
  /** Edit finished, close cell and save */
  protected cellEdit(e: Edition.SaveDataDetails): void;
  private focusNext;
  protected clearCell(): void;
  private onRowDragStart;
  /** Check if edit possible */
  protected canEdit(): boolean;
  get types(): AllDimensionType;
  /** Collect data from element */
  protected getData(): {
    el: HTMLElement;
    rows: RevoGrid.DimensionSettingsState;
    cols: RevoGrid.DimensionSettingsState;
    lastCell: Selection.Cell;
  };
}
