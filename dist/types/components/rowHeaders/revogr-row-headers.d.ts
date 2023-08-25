import { EventEmitter } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
import { ElementScroll } from '../revoGrid/viewport.scrolling.service';
import { ViewportData } from '../revoGrid/viewport.interfaces';
/**
 * Row headers component
 * Visible on the left side of the table
 */
export declare class RevogrRowHeaders {
  height: number;
  dataPorts: ViewportData[];
  headerProp: Record<string, any>;
  uiid: string;
  rowClass: string;
  resize: boolean;
  rowHeaderColumn: RevoGrid.RowHeaders;
  /** Additional data to pass to renderer */
  additionalData: any;
  scrollViewport: EventEmitter<RevoGrid.ViewPortScrollEvent>;
  elementToScroll: EventEmitter<ElementScroll>;
  render(): any;
}
