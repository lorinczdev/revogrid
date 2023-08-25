import { VNode } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
import { Group } from '../../store/dataSource/data.store';
import { ResizeProps } from '../..';
type Props<T> = {
  visibleProps: {
    [prop: string]: number;
  };
  groups: Record<number, Group[]>;
  dimensionCol: Pick<RevoGrid.DimensionSettingsState, 'indexes' | 'originItemSize' | 'indexToItem'>;
  depth: number;
  canResize: boolean;
  providers: RevoGrid.Providers<T>;
  additionalData: any;
  onResize(changedX: number, startIndex: number, endIndex: number): void;
} & Partial<Pick<ResizeProps, 'active'>>;
declare const ColumnGroupsRenderer: ({ additionalData, providers, depth, groups, visibleProps, dimensionCol, canResize, active, onResize }: Props<RevoGrid.DimensionCols | 'rowHeaders'>) => VNode[];
export default ColumnGroupsRenderer;
