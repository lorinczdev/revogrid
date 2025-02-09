import { h, VNode } from '@stencil/core';
import { ResizeEvent, ResizeProps } from '../../services/resizable.directive';
import { Group } from '../../store/dataSource/data.store';
import { HEADER_CLASS, MIN_COL_SIZE } from '../../utils/consts';
import { HeaderCellRenderer } from '../../components/header/headerCellRenderer';
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

const GroupHeaderRenderer = (p: Props): VNode[] => {
  const groupProps: RevoGrid.CellProps & Partial<ResizeProps> = {
    canResize: p.canResize,
    minWidth: p.group.ids.length * MIN_COL_SIZE,
    maxWidth: 0,

    active: p.active || ['r'],
    class: {
      [HEADER_CLASS]: true,
    },
    style: {
      transform: `translateX(${p.start}px)`,
      width: `${p.end - p.start}px`,
    },
    onResize: p.onResize,
  };
  return (
    <HeaderCellRenderer
      data={{
        ...p.group,
        prop: '',
        providers: p.providers,
        index: p.start,
      }}
      props={groupProps}
      additionalData={p.additionalData}
    />
  );
};

export default GroupHeaderRenderer;
