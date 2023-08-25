import { VNode } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
import { ResizeProps } from '../../services/resizable.directive';
type Props = {
  props: RevoGrid.CellProps & Partial<ResizeProps>;
  additionalData: any;
  data?: RevoGrid.ColumnTemplateProp;
};
export declare const HeaderCellRenderer: ({ data, props, additionalData }: Props, children: VNode[]) => VNode;
export {};
