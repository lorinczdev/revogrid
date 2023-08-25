import { EventEmitter } from '../../stencil-public-runtime';
import { HTMLStencilElement } from '../../stencil-public-runtime';
import { ColumnSource, RowSource } from './columnService';
import { Observable, RevoGrid, Selection } from '../../interfaces';
/**
 * This component is responsible for rendering data
 * Rows, columns, groups and cells
 */
export declare class RevogrData {
  private columnService;
  element: HTMLStencilElement;
  /**
   * If readonly mode enables
   */
  readonly: boolean;
  /**
   * Range selection mode
   */
  range: boolean;
  /**
   * Defines property from which to read row class
   */
  rowClass: string;
  /**
   * Additional data to pass to renderer
   * Used in plugins such as vue or react to pass root app entity to cells
   */
  additionalData: any;
  rowSelectionStore: Observable<Selection.SelectionStoreState>;
  viewportRow: Observable<RevoGrid.ViewportState>;
  viewportCol: Observable<RevoGrid.ViewportState>;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  /** Static stores, not expected to change during component lifetime */
  colData: ColumnSource;
  dataStore: RowSource;
  type: RevoGrid.DimensionRows;
  /**
   * Before each row render
   */
  beforeRowRender: EventEmitter;
  /**
   * When data render finished for the designated type
   */
  afterrender: EventEmitter;
  private renderedRows;
  private currentRange;
  private rangeUnsubscribe;
  providers: RevoGrid.Providers;
  onStoreChange(): void;
  connectedCallback(): void;
  disconnectedCallback(): void;
  componentDidRender(): void;
  render(): any;
}
