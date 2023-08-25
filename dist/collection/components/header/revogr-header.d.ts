import { EventEmitter } from '../../stencil-public-runtime';
import { HTMLStencilElement } from '../../stencil-public-runtime';
import { Observable, RevoGrid, Selection } from '../../interfaces';
import { Groups } from '../../store/dataSource/data.store';
import { ResizeProps } from '../../services/resizable.directive';
export declare class RevogrHeaderComponent {
  element: HTMLStencilElement;
  viewportCol: Observable<RevoGrid.ViewportState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  selectionStore: Observable<Selection.SelectionStoreState>;
  parent: string;
  groups: Groups;
  groupingDepth: number;
  /**
   * If columns can be resized
   */
  canResize: boolean;
  /**
   * Define custom resize position
   */
  resizeHandler: ResizeProps['active'];
  colData: RevoGrid.ColumnRegular[];
  columnFilter: boolean;
  /**
   * Column type
   */
  type: RevoGrid.DimensionCols | 'rowHeaders';
  /**
   * Extra properties to pass into header renderer, such as vue or react components to handle parent
   */
  additionalData: any;
  initialHeaderClick: EventEmitter<RevoGrid.InitialHeaderClick>;
  headerresize: EventEmitter<RevoGrid.ViewSettingSizeProp>;
  beforeResize: EventEmitter<RevoGrid.ColumnRegular[]>;
  headerdblClick: EventEmitter<RevoGrid.InitialHeaderClick>;
  private onResize;
  private onResizeGroup;
  render(): any[];
  get providers(): RevoGrid.Providers<RevoGrid.DimensionCols | 'rowHeaders'>;
}
