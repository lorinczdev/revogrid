import { EventEmitter } from '../../stencil-public-runtime';
import { BeforeCellRenderEvent, DragStartEvent, RevoGrid } from '../../interfaces';
import ColumnService from './columnService';
/**
 * Component is responsible for rendering cell
 * Main purpose is to track changes and understand what exactly need to be rerendered instead of full grid render
 */
export declare class RevogridCellRenderer {
  /**
   * Additional data to pass to renderer
   * Used in plugins such as vue or react to pass root app entity to cells
   */
  additionalData: any;
  /**
   * Column service
   */
  columnService: ColumnService;
  /**
   * Cached providers
   */
  providers: RevoGrid.Providers;
  /**
   * Grouping
   */
  depth: number;
  /**
   * Row props passed via property
   */
  rowIndex: number;
  rowStart: number;
  rowEnd: number;
  rowSize: number;
  /**
   * Column props passed via property
   */
  colIndex: number;
  colStart: number;
  colEnd: number;
  colSize: number;
  /**
   * Before each cell render function. Allows to override cell properties
   */
  beforeCellRender: EventEmitter<BeforeCellRenderEvent>;
  dragStartCell: EventEmitter<DragStartEvent>;
  render(): any;
}
