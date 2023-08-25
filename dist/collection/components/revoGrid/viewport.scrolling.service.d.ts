import { RevoGrid } from '../../interfaces';
export interface ElementScroll {
  changeScroll?(e: RevoGrid.ViewPortScrollEvent, silent?: boolean): Promise<RevoGrid.ViewPortScrollEvent>;
  setScroll(e: RevoGrid.ViewPortScrollEvent): Promise<void>;
}
export type ElementsScroll = {
  [key: string]: ElementScroll[];
};
export default class GridScrollingService {
  private setViewport;
  private elements;
  constructor(setViewport: (e: RevoGrid.ViewPortScrollEvent) => void);
  scrollService(e: RevoGrid.ViewPortScrollEvent, key?: RevoGrid.DimensionColPin | string): Promise<void>;
  /**
   * Silent scroll update for mobile devices when we have negative scroll top
   */
  scrollSilentService(e: RevoGrid.ViewPortScrollEvent, key?: RevoGrid.DimensionColPin | string): Promise<void>;
  private isPinnedColumn;
  registerElements(els: ElementsScroll): void;
  /**
   * Register new element for farther scroll support
   * @param el - can be null if holder removed
   * @param key - element key
   */
  registerElement(el: ElementScroll | null, key: string): void;
  unregister(): void;
}
