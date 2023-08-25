import DataStore, { Groups } from '../store/dataSource/data.store';
import DimensionProvider from './dimension.provider';
import { RevoGrid, Edition } from '../interfaces';
import { Trimmed } from '../store/dataSource/trimmed.plugin';
import { GroupLabelTemplateFunc } from '../plugins/groupingRow/grouping.row.types';
export type RowDataSources = {
  [T in RevoGrid.DimensionRows]: DataStore<RevoGrid.DataType, RevoGrid.DimensionRows>;
};
export declare class DataProvider {
  private dimensionProvider;
  readonly stores: RowDataSources;
  constructor(dimensionProvider: DimensionProvider);
  setData(data: RevoGrid.DataType[], type?: RevoGrid.DimensionRows, grouping?: {
    depth: number;
    groups?: Groups;
    customRenderer?: GroupLabelTemplateFunc;
  }, silent?: boolean): RevoGrid.DataType[];
  getModel(virtualIndex: number, type?: RevoGrid.DimensionRows): any;
  setCellData({ type, rowIndex, prop, val }: Edition.BeforeSaveDataDetails): void;
  refresh(type?: RevoGrid.DimensionRows | 'all'): void;
  refreshItems(type?: RevoGrid.DimensionRows): void;
  setGrouping({ depth }: {
    depth: number;
  }, type?: RevoGrid.DimensionRows): void;
  setTrimmed(trimmed: Partial<Trimmed>, type?: RevoGrid.DimensionRows): void;
}
