import { Observable, RevoGrid, Selection } from '../../interfaces';
/**
 * Temporary range selection
 */
export declare class RevogrFocus {
  el: HTMLElement;
  /**
   * Selection store, shows current selection and focus
   */
  selectionStore: Observable<Selection.SelectionStoreState>;
  /**
   * Dimension row store
   */
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  /**
   * Dimension column store
   */
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  private readonly onChange;
  private doChange;
  componentDidRender(): void;
  render(): any;
  private getRange;
}
