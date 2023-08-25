import { VNode } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
type HeaderRender = {
  (start: number): (h: RevoGrid.HyperFunc<VNode>, e: {
    rowIndex: number;
  }) => number;
};
export declare const RowHeaderRender: HeaderRender;
export {};
