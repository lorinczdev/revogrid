import DimensionStore from '../store/dimension/dimension.store';
import ViewportProvider from './viewport.provider';
import { RevoGrid } from '../interfaces';
import { Trimmed } from '../store/dataSource/trimmed.plugin';
export type ColumnItems = Record<RevoGrid.DimensionCols, RevoGrid.ColumnRegular[]>;
export type DimensionStores = {
  [T in RevoGrid.MultiDimensionType]: DimensionStore;
};
export type DimensionConfig = {
  realSizeChanged(k: RevoGrid.MultiDimensionType): void;
};
/**
 * Dimension provider
 * Stores dimension information and custom sizes
 */
export default class DimensionProvider {
  private viewports;
  readonly stores: DimensionStores;
  constructor(viewports: ViewportProvider, config: DimensionConfig);
  /**
   * Clear old sizes from dimension and viewports
   * @param type - dimension type
   * @param count - count of items
   */
  clearSize(t: RevoGrid.MultiDimensionType, count: number): void;
  /**
   * Apply new custom sizes to dimension and view port
   * @param type - dimension type
   * @param sizes - new custom sizes
   * @param keepOld - keep old sizes merge new with old
   */
  setCustomSizes(type: RevoGrid.MultiDimensionType, sizes: RevoGrid.ViewSettingSizeProp, keepOld?: boolean): void;
  setItemCount(realCount: number, type: RevoGrid.MultiDimensionType): void;
  /**
   * Apply trimmed items
   * @param trimmed - trimmed items
   * @param type
   */
  setTrimmed(trimmed: Partial<Trimmed>, type: RevoGrid.MultiDimensionType): void;
  /**
   * Sets dimension data and view port coordinate
   * @param items - data/column items
   * @param type - dimension type
   */
  setData(itemCount: number, type: RevoGrid.MultiDimensionType, noVirtual?: boolean): void;
  /**
   * Virtualization will get disabled
   * @param type - dimension type
   */
  private setNoVirtual;
  /**
   * Drop all dimension data
   */
  dropColumns(types?: RevoGrid.MultiDimensionType[]): void;
  getFullSize(): {
    x: number;
    y: number;
  };
  setNewColumns(type: RevoGrid.MultiDimensionType, newLength: number, sizes?: RevoGrid.ViewSettingSizeProp, noVirtual?: boolean): void;
  updateViewport(type: RevoGrid.MultiDimensionType): void;
  setViewPortCoordinate({ coordinate, type }: {
    coordinate: number;
    type: RevoGrid.MultiDimensionType;
  }): void;
  getViewPortPos(e: RevoGrid.ViewPortScrollEvent): number;
  setSettings(data: Partial<RevoGrid.DimensionSettingsState>, dimensionType: RevoGrid.DimensionType): void;
}
