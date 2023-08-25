import { VNode } from '../../stencil-public-runtime';
import { RevoGrid, Selection } from '../../interfaces';
import { ResizeEvent, ResizeProps } from '../../services/resizable.directive';
type Props = {
  column: RevoGrid.VirtualPositionItem;
  additionalData: any;
  data?: RevoGrid.ColumnTemplateProp;
  range?: Selection.RangeArea;
  canResize?: boolean;
  canFilter?: boolean;
  onResize?(e: ResizeEvent): void;
  onClick?(data: RevoGrid.InitialHeaderClick): void;
  onDoubleClick?(data: RevoGrid.InitialHeaderClick): void;
} & Partial<Pick<ResizeProps, 'active'>>;
declare const HeaderRenderer: (p: Props) => VNode;
export default HeaderRenderer;
