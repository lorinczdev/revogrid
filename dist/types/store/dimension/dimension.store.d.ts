/**
 * Storing pre-calculated
 * Dimension information and sizes
 */
import { Observable, RevoGrid } from '../../interfaces';
export default class DimensionStore {
  readonly store: Observable<RevoGrid.DimensionSettingsState>;
  constructor();
  getCurrentState(): RevoGrid.DimensionSettingsState;
  dispose(): void;
  setStore<T extends Record<string, any>>(data: Partial<T>): void;
  drop(): void;
  /**
   * Set custom dimension sizes and overwrite old
   * Generates new indexes based on sizes
   * @param sizes - sizes to set
   */
  setDimensionSize(sizes: RevoGrid.ViewSettingSizeProp): {
    indexes: number[];
    positionIndexes: number[];
    positionIndexToItem: {
      [x: number]: RevoGrid.PositionItem;
    };
    indexToItem: {
      [index: number]: RevoGrid.PositionItem;
    };
    sizes: {
      [x: string]: number;
    };
  };
}
