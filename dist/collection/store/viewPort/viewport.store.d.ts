/**
 * Store is responsible for visible
 * Viewport information for each dimension
 * Redraw items during scrolling
 */
import { DimensionDataViewport } from './viewport.helpers';
import { Observable, RevoGrid } from '../../interfaces';
export default class ViewportStore {
  readonly type: RevoGrid.MultiDimensionType;
  readonly store: Observable<RevoGrid.ViewportState>;
  private lastKnownScroll;
  get lastCoordinate(): number;
  private set lastCoordinate(value);
  constructor(type: RevoGrid.MultiDimensionType);
  /**
   * Render viewport based on coordinate
   * It's the main method for draw
   */
  setViewPortCoordinate(position: number, dimension: DimensionDataViewport): void;
  /**
   * Update viewport sizes for existing items
   * This method is generating new item positions based on custom sizes and original sizes
   * @param sizes - custom sizes for each item
   * @param dropToOriginalSize - drop to original size if requested
   */
  setViewPortDimensionSizes(sizes: RevoGrid.ViewSettingSizeProp, dropToOriginalSize?: number): void;
  /**
   * Set sizes for existing items
   */
  setOriginalSizes(size: number): void;
  getItems(): Pick<RevoGrid.ViewportStateItems, 'items' | 'start' | 'end'>;
  setViewport(data: Partial<RevoGrid.ViewportState>): void;
  clearItems(): void;
}
