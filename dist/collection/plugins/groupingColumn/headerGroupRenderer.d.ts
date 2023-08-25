import { VNode } from '../../stencil-public-runtime';
import { ResizeEvent, ResizeProps } from '../../services/resizable.directive';
import { Group } from '../../store/dataSource/data.store';
import { RevoGrid } from '../../interfaces';
type Props = {
  start: number;
  end: number;
  group: Group;
  providers: RevoGrid.Providers<RevoGrid.DimensionCols | 'rowHeaders'>;
  additionalData: any;
  canResize?: boolean;
  onResize?(e: ResizeEvent): void;
} & Partial<Pick<ResizeProps, 'active'>>;
declare const GroupHeaderRenderer: (p: Props) => VNode[];
export default GroupHeaderRenderer;
