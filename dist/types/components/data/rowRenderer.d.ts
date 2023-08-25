import { VNode } from '../../stencil-public-runtime';
import { JSXBase } from '../../stencil-public-runtime';
export interface RowProps extends JSXBase.HTMLAttributes {
  size: number;
  start: number;
  index: number;
  rowClass?: string;
  depth?: number;
}
export declare const PADDING_DEPTH = 10;
declare const RowRenderer: ({ rowClass, index, size, start, depth }: RowProps, cells: VNode[]) => any;
export default RowRenderer;
