import { EventEmitter } from '../../stencil-public-runtime';
import { FocusRenderEvent, Observable, RevoGrid, Selection } from '../../interfaces';
import { ColumnSource, RowSource } from '../data/columnService';
export declare class RevogrFocus {
  el: HTMLElement;
  /** Dynamic stores */
  selectionStore: Observable<Selection.SelectionStoreState>;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  dataStore: RowSource;
  colData: ColumnSource;
  colType: RevoGrid.DimensionCols;
  rowType: RevoGrid.DimensionRows;
  focusTemplate: RevoGrid.FocusTemplateFunc | null;
  beforeFocusRender: EventEmitter<FocusRenderEvent>;
  /**
   * Before focus changed verify if it's in view and scroll viewport into this view
   * Can be prevented by event.preventDefault()
   */
  beforeScrollIntoView: EventEmitter<{
    el: HTMLElement;
  }>;
  /**
   * Used to setup properties after focus was rendered
   */
  afterFocus: EventEmitter<{
    model: any;
    column: RevoGrid.ColumnRegular;
  }>;
  private activeFocus;
  private changed;
  componentDidRender(): void;
  render(): any;
}
