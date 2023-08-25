import { EventEmitter, VNode } from '../../stencil-public-runtime';
import ColumnDataProvider, { ColumnCollection } from '../../services/column.data.provider';
import { DataProvider } from '../../services/data.provider';
import DimensionProvider from '../../services/dimension.provider';
import ViewportProvider from '../../services/viewport.provider';
import { Edition, Selection, RevoGrid, ThemeSpace, RevoPlugin } from '../../interfaces';
import { AutoSizeColumnConfig } from '../../plugins/autoSizeColumn';
import { ColumnFilterConfig, FilterCollection } from '../../plugins/filter/filter.plugin';
import { DataInput } from '../../plugins/export/types';
import { GroupingOptions } from '../../plugins/groupingRow/grouping.row.types';
import { ColumnSource, RowSource } from '../data/columnService';
import { FocusedData } from './viewport.service';
/**
 * Slots
 * @slot data-{column-type}-{row-type}. @example data-rgCol-rgRow - main data slot
 * @slot focus-${view.type}-${data.type}. @example focus-rgCol-rgRow - focus layer for main data
 */
export declare class RevoGridComponent {
  /** Excel like show rgRow indexe per rgRow */
  rowHeaders: RevoGrid.RowHeaders | boolean;
  /**
   * Defines how many rows/columns should be rendered outside visible area.
   */
  frameSize: number;
  /**
   * Indicates default rgRow size.
   * By default 0, means theme package size will be applied
   */
  rowSize: number;
  /** Indicates default column size. */
  colSize: number;
  /** When true, user can range selection. */
  range: boolean;
  /** When true, grid in read only mode. */
  readonly: boolean;
  /** When true, columns are resizable. */
  resize: boolean;
  /** When true cell focus appear. */
  canFocus: boolean;
  /** When true enable clipboard. */
  useClipboard: boolean;
  /**
   * Columns - defines an array of grid columns.
   * Can be column or grouped column.
   */
  columns: (RevoGrid.ColumnRegular | RevoGrid.ColumnGrouping)[];
  /**
   * Source - defines main data source.
   * Can be an Object or 2 dimensional array([][]);
   * Keys/indexes referenced from columns Prop
   */
  source: RevoGrid.DataType[];
  /** Pinned top Source: {[T in ColumnProp]: any} - defines pinned top rows data source. */
  pinnedTopSource: RevoGrid.DataType[];
  /** Pinned bottom Source: {[T in ColumnProp]: any} - defines pinned bottom rows data source. */
  pinnedBottomSource: RevoGrid.DataType[];
  /** Row properies applied */
  rowDefinitions: RevoGrid.RowDefinition[];
  /** Custom editors register */
  editors: Edition.Editors;
  /**
   * Apply changes typed in editor on editor close except Escape cases
   * If custom editor in use @method getValue required
   * Check interfaces.d.ts @EditorBase for more info
   */
  applyOnClose: boolean;
  /**
   * Custom grid plugins
   * Has to be predefined during first grid init
   * Every plugin should be inherited from BasePlugin
   */
  plugins: RevoPlugin.PluginClass[];
  /** Column Types Format
   *  Every type represent multiple column properties
   *  Types will be merged but can be replaced with column properties
   *  Types were made as separate objects to be reusable per multiple columns
   */
  columnTypes: {
    [name: string]: RevoGrid.ColumnType;
  };
  /** Theme name */
  theme: ThemeSpace.Theme;
  /**
   * Row class property
   * Define this property in rgRow object and this will be mapped as rgRow class
   */
  rowClass: string;
  /**
   * Autosize config
   * Enable columns autoSize, for more details check @autoSizeColumn plugin
   * By default disabled, hence operation is not resource efficient
   * true to enable with default params (double header separator click for autosize)
   * or provide config
   */
  autoSizeColumn: boolean | AutoSizeColumnConfig;
  /**
   * Enables filter plugin
   * Can be boolean
   * Can be filter collection
   */
  filter: boolean | ColumnFilterConfig;
  /**
   * Apply changes typed in editor on editor close except Escape cases
   * If custom editor in use @method getValue required
   * Check interfaces.d.ts @EditorBase for more info
   */
  focusTemplate: RevoGrid.FocusTemplateFunc;
  /**
   * Enables column move plugin
   * Can be boolean
   */
  canMoveColumns: boolean;
  /**
   * Trimmed rows
   * Functionality which allows to hide rows from main data set
   * @trimmedRows are physical rgRow indexes to hide
   */
  trimmedRows: Record<number, boolean>;
  /**
   * Enables export plugin
   * Can be boolean
   * Can be export options
   */
  exporting: boolean;
  /**
   * Group models by provided properties
   * Define properties to be groped by
   */
  grouping: GroupingOptions;
  /**
   * Defines stretch strategy for columns with @StretchColumn plugin
   * if there are more space on the right last column size would be increased
   */
  stretch: boolean | string;
  /**
   * Additional data to be passed to plugins
   */
  additionalData: any;
  /**
   * contentsizechanged event.
   * Triggered when new content size applied.
   * Not including header size
   * Event is not returning size
   * To get actual size use getContentSize after event triggered
   */
  contentsizechanged: EventEmitter<RevoGrid.MultiDimensionType>;
  /**
   * Before edit event.
   * Triggered before edit data applied.
   * Use e.preventDefault() to prevent edit data set and use you own.
   * Use e.val = {your value} to replace edit result with your own.
   */
  beforeedit: EventEmitter<Edition.BeforeSaveDataDetails>;
  /**
   * Before range edit event.
   * Triggered before range data applied, when range selection happened.
   * Use e.preventDefault() to prevent edit data set and use you own.
   */
  beforerangeedit: EventEmitter<Edition.BeforeRangeSaveDataDetails>;
  /**
   * After edit.
   * Triggered after data applied or range changed.
   */
  afteredit: EventEmitter<Edition.BeforeSaveDataDetails | Edition.BeforeRangeSaveDataDetails>;
  /**
   * Before autofill.
   * Triggered before autofill applied.
   * Use e.preventDefault() to prevent edit data apply.
   */
  beforeautofill: EventEmitter<Selection.ChangedRange>;
  /**
   * Before range apply.
   * Triggered before range applied.
   * Use e.preventDefault() to prevent range.
   */
  beforeange: EventEmitter<Selection.ChangedRange>;
  /**
   * Triggered after focus render finished.
   * Can be used to access a focus element through @event.target
   */
  afterfocus: EventEmitter<{
    model: any;
    column: RevoGrid.ColumnRegular;
  }>;
  /**
   * Before rgRow order apply.
   * Use e.preventDefault() to prevent rgRow order change.
   */
  roworderchanged: EventEmitter<{
    from: number;
    to: number;
  }>;
  /**
   * Before source update sorting apply.
   * Use this event if you intended to prevent sorting on data update.
   * Use e.preventDefault() to prevent sorting data change during rows source update.
   */
  beforesourcesortingapply: EventEmitter;
  /**
   * Before sorting apply.
   * Use e.preventDefault() to prevent sorting data change.
   */
  beforesortingapply: EventEmitter<{
    column: RevoGrid.ColumnRegular;
    order: 'desc' | 'asc';
    additive: boolean;
  }>;
  /**
   * Before sorting event.
   * Initial sorting triggered, if this event stops no other event called.
   * Use e.preventDefault() to prevent sorting.
   */
  beforesorting: EventEmitter<{
    column: RevoGrid.ColumnRegular;
    order: 'desc' | 'asc';
    additive: boolean;
  }>;
  /**
   * Row order change started.
   * Use e.preventDefault() to prevent rgRow order change.
   * Use e.text = 'new name' to change item name on start.
   */
  rowdragstart: EventEmitter<{
    pos: RevoGrid.PositionItem;
    text: string;
  }>;
  /**
   * On header click.
   */
  headerclick: EventEmitter<RevoGrid.ColumnRegular>;
  /**
   * Before cell focus changed.
   * Use e.preventDefault() to prevent cell focus change.
   */
  beforecellfocus: EventEmitter<Edition.BeforeSaveDataDetails>;
  /**
   * Before grid focus lost happened.
   * Use e.preventDefault() to prevent cell focus change.
   */
  beforefocuslost: EventEmitter<FocusedData | null>;
  /**
   * Before data apply.
   * You can override data source here
   */
  beforesourceset: EventEmitter<{
    type: RevoGrid.DimensionRows;
    source: RevoGrid.DataType[];
  }>;
  /**
  * Before data apply.
  * You can override data source here
  */
  beforeAnySource: EventEmitter<{
    type: RevoGrid.DimensionRows;
    source: RevoGrid.DataType[];
  }>;
  /**  After rows updated */
  aftersourceset: EventEmitter<{
    type: RevoGrid.DimensionRows;
    source: RevoGrid.DataType[];
  }>;
  /**
   * After all rows updated. Use it if you want to track all changes from sources pinned and main
   */
  afterAnySource: EventEmitter<{
    type: RevoGrid.DimensionRows;
    source: RevoGrid.DataType[];
  }>;
  /**  Before column update */
  beforecolumnsset: EventEmitter<ColumnCollection>;
  /**  Before column applied but after column set gathered and viewport updated */
  beforecolumnapplied: EventEmitter<ColumnCollection>;
  /**  Column updated */
  aftercolumnsset: EventEmitter<{
    columns: ColumnCollection;
    order: Record<RevoGrid.ColumnProp, 'asc' | 'desc'>;
  }>;
  /**
   * Before filter applied to data source
   * Use e.preventDefault() to prevent cell focus change
   * Update @collection if you wish to change filters
   */
  beforefilterapply: EventEmitter<{
    collection: FilterCollection;
  }>;
  /**
   * Before filter trimmed values
   * Use e.preventDefault() to prevent value trimming and filter apply
   * Update @collection if you wish to change filters
   * Update @itemsToFilter if you wish to filter indexes of trimming
   */
  beforefiltertrimmed: EventEmitter<{
    collection: FilterCollection;
    itemsToFilter: Record<number, boolean>;
  }>;
  /**
   * Before trimmed values
   * Use e.preventDefault() to prevent value trimming
   * Update @trimmed if you wish to filter indexes of trimming
   */
  beforetrimmed: EventEmitter<{
    trimmed: Record<number, boolean>;
    trimmedType: string;
    type: string;
  }>;
  /**
   * Notify trimmed applied
   */
  aftertrimmed: EventEmitter;
  /**
   * Triggered when view port scrolled
   */
  viewportscroll: EventEmitter<RevoGrid.ViewPortScrollEvent>;
  /**
   * Before export
   * Use e.preventDefault() to prevent export
   * Replace data in Event in case you want to modify it in export
   */
  beforeexport: EventEmitter<DataInput>;
  /**
   * Before edit started
   * Use e.preventDefault() to prevent edit
   */
  beforeeditstart: EventEmitter<Edition.BeforeSaveDataDetails>;
  /**
   * After column resize
   * Get resized columns
   */
  aftercolumnresize: EventEmitter<{
    [index: number]: RevoGrid.ColumnRegular;
  }>;
  /**
   * Before row definition
   */
  beforerowdefinition: EventEmitter<{
    vals: any;
    oldVals: any;
  }>;
  /**
   * Refreshes data viewport.
   * Can be specific part as rgRow or pinned rgRow or 'all' by default.
   */
  refresh(type?: RevoGrid.DimensionRows | 'all'): Promise<void>;
  /**  Scrolls view port to specified rgRow index */
  scrollToRow(coordinate?: number): Promise<void>;
  /** Scrolls view port to specified column index */
  scrollToColumnIndex(coordinate?: number): Promise<void>;
  /**  Scrolls view port to specified column prop */
  scrollToColumnProp(prop: RevoGrid.ColumnProp): Promise<void>;
  /** Update columns */
  updateColumns(cols: RevoGrid.ColumnRegular[]): Promise<void>;
  /** Add trimmed by type */
  addTrimmed(trimmed: Record<number, boolean>, trimmedType?: string, type?: RevoGrid.DimensionRows): Promise<CustomEvent<{
    trimmed: Record<number, boolean>;
    trimmedType: string;
    type: string;
  }>>;
  /**  Scrolls view port to coordinate */
  scrollToCoordinate(cell: Partial<Selection.Cell>): Promise<void>;
  /**  Bring cell to edit mode */
  setCellEdit(rgRow: number, prop: RevoGrid.ColumnProp, rowSource?: RevoGrid.DimensionRows): Promise<void>;
  /**  Set focus range */
  setCellsFocus(cellStart?: Selection.Cell, cellEnd?: Selection.Cell, colType?: string, rowType?: string): Promise<void>;
  /**
   * Register new virtual node inside of grid
   * Used for additional items creation such as plugin elements
   */
  registerVNode(elements: VNode[]): Promise<void>;
  /**  Get data from source */
  getSource(type?: RevoGrid.DimensionRows): Promise<RevoGrid.DataType[]>;
  /**
   * Get data from visible part of source
   * Trimmed/filtered rows will be excluded
   * @param type - type of source
   */
  getVisibleSource(type?: RevoGrid.DimensionRows): Promise<any[]>;
  /**
   * Provides access to rows internal store observer
   * Can be used for plugin support
   * @param type - type of source
   */
  getSourceStore(type?: RevoGrid.DimensionRows): Promise<RowSource>;
  /**
   * Provides access to column internal store observer
   * Can be used for plugin support
   * @param type - type of column
   */
  getColumnStore(type?: RevoGrid.DimensionCols): Promise<ColumnSource>;
  /**
   * Update column sorting
   * @param column - full column details to update
   * @param index - virtual column index
   * @param order - order to apply
   */
  updateColumnSorting(column: RevoGrid.ColumnRegular, index: number, order: 'asc' | 'desc', additive: boolean): Promise<RevoGrid.ColumnRegular>;
  /**
   * Clears column sorting
   */
  clearSorting(): Promise<void>;
  /**
   * Receive all columns in data source
   */
  getColumns(): Promise<RevoGrid.ColumnRegular[]>;
  /**
   * Clear current grid focus
   */
  clearFocus(): Promise<void>;
  /**
   * Get all active plugins instances
   */
  getPlugins(): Promise<RevoPlugin.Plugin[]>;
  /**
   * Get the currently focused cell.
   */
  getFocused(): Promise<FocusedData | null>;
  /**
   * Get size of content
   * Including all pinned data
   */
  getContentSize(): Promise<Selection.Cell>;
  /**
   * Get the currently selected Range.
   */
  getSelectedRange(): Promise<Selection.RangeArea | null>;
  private clickTrackForFocusClear;
  mousedownHandle(event: MouseEvent | TouchEvent): void;
  mouseupHandle(event: MouseEvent | TouchEvent): void;
  /** DRAG AND DROP */
  onRowDragStarted(e: CustomEvent<{
    pos: RevoGrid.PositionItem;
    text: string;
    event: MouseEvent;
  }>): void;
  onRowDragEnd(): void;
  onRowDrag({ detail }: CustomEvent<RevoGrid.PositionItem>): void;
  onRowMouseMove(e: CustomEvent<Selection.Cell>): void;
  onBeforeEdit(e: CustomEvent<Edition.BeforeSaveDataDetails>): Promise<void>;
  onBeforeRangeEdit(e: CustomEvent<Edition.BeforeRangeSaveDataDetails>): void;
  onRangeChanged(e: CustomEvent<Selection.ChangedRange>): void;
  onRowDropped(e: CustomEvent<{
    from: number;
    to: number;
  }>): void;
  onHeaderClick(e: CustomEvent<RevoGrid.InitialHeaderClick>): void;
  onCellFocus(e: CustomEvent<Edition.BeforeSaveDataDetails>): void;
  extraElements: VNode[];
  uuid: string | null;
  columnProvider: ColumnDataProvider;
  dataProvider: DataProvider;
  dimensionProvider: DimensionProvider;
  viewportProvider: ViewportProvider;
  private themeService;
  private viewport;
  private orderService;
  private selectionStoreConnector;
  private scrollingService;
  /**
   * Plugins
   * Define plugins collection
   */
  private internalPlugins;
  element: HTMLRevoGridElement;
  /**
   * Column format change will trigger column structure update
   */
  columnTypesChanged(): void;
  columnChanged(newVal?: RevoGrid.ColumnDataSchema[]): void;
  rowSizeChanged(s: number): void;
  themeChanged(t: ThemeSpace.Theme): void;
  dataSourceChanged<T extends RevoGrid.DataType>(newVal: T[], _: T[] | undefined, watchName: string): void;
  rowDefChanged(after: any, before?: any): void;
  trimmedRowsChanged(newVal?: Record<number, boolean>): void;
  /**
   * Grouping
   */
  groupingChanged(newVal?: GroupingOptions): void;
  /**
   * Stretch Plugin Apply
   */
  applyStretch(isStretch: boolean | string): void;
  /** External subscribe */
  filterconfigchanged: EventEmitter;
  applyFilter(cfg: boolean | ColumnFilterConfig): void;
  rowheaderschanged: EventEmitter;
  rowHeadersChange(rowHeaders?: RevoGrid.RowHeaders | boolean): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  render(): any;
}
