import { VNode } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
export type GroupLabelTemplateFunc = (createElement: RevoGrid.HyperFunc<VNode>, props: {
  name: string;
  itemIndex: number;
  expanded: boolean;
  depth: number;
}) => any;
export type GroupingOptions = {
  props?: RevoGrid.ColumnProp[];
  /** is expanded by default */
  expandedAll?: boolean;
  groupLabelTemplate?: GroupLabelTemplateFunc;
};
export type BeforeSourceSetEvent = {
  type: RevoGrid.DimensionRows;
  source: RevoGrid.DataType[];
};
export type OnExpandEvent = {
  model: RevoGrid.DataType;
  virtualIndex: number;
};
export type SourceGather = {
  source: RevoGrid.DataType[];
  prevExpanded: Record<string, boolean>;
  oldNewIndexes?: Record<number, number>;
};
