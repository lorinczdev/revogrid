import reduce from 'lodash/reduce';

import DataStore, { getSourceItem, getVisibleSourceItem, Groups, setSourceByVirtualIndex } from '../store/dataSource/data.store';
import { isRowType, rowTypes } from '../store/storeTypes';
import DimensionProvider from './dimension.provider';
import { RevoGrid, Edition } from '../interfaces';
import { Trimmed } from '../store/dataSource/trimmed.plugin';
import { GroupLabelTemplateFunc } from '../plugins/groupingRow/grouping.row.types';

export type RowDataSources = { [T in RevoGrid.DimensionRows]: DataStore<RevoGrid.DataType, RevoGrid.DimensionRows> };

export class DataProvider {
  public readonly stores: RowDataSources;
  constructor(private dimensionProvider: DimensionProvider) {
    this.stores = reduce(
      rowTypes,
      (sources: Partial<RowDataSources>, k: RevoGrid.DimensionRows) => {
        sources[k] = new DataStore(k);
        return sources;
      },
      {},
    ) as RowDataSources;
  }

  setData(
    data: RevoGrid.DataType[],
    type: RevoGrid.DimensionRows = 'rgRow',
    grouping?: { depth: number; groups?: Groups, customRenderer?: GroupLabelTemplateFunc },
    silent = false,
  ): RevoGrid.DataType[] {
    // set rgRow data
    this.stores[type].updateData([...data], grouping, silent);
    this.dimensionProvider.setData(data.length, type, type !== 'rgRow');
    return data;
  }

  getModel(virtualIndex: number, type: RevoGrid.DimensionRows = 'rgRow') {
    const store = this.stores[type].store;
    return getSourceItem(store, virtualIndex);
  }

  setCellData({ type, rowIndex, prop, val }: Edition.BeforeSaveDataDetails) {
    const model = this.getModel(rowIndex, type);
    model[prop] = val;
    setSourceByVirtualIndex(this.stores[type].store, { [rowIndex]: model });
  }

  refresh(type: RevoGrid.DimensionRows | 'all' = 'all') {
    if (isRowType(type)) {
      this.refreshItems(type);
    }
    rowTypes.forEach((t: RevoGrid.DimensionRows) => this.refreshItems(t));
  }

  refreshItems(type: RevoGrid.DimensionRows = 'rgRow') {
    const items = this.stores[type].store.get('items');
    this.stores[type].setData({ items: [...items] });
  }

  setGrouping({ depth }: { depth: number }, type: RevoGrid.DimensionRows = 'rgRow') {
    this.stores[type].setData({ groupingDepth: depth });
  }

  setTrimmed(trimmed: Partial<Trimmed>, type: RevoGrid.DimensionRows = 'rgRow') {
    const store = this.stores[type];
    store.addTrimmed(trimmed);
    this.dimensionProvider.setTrimmed(trimmed, type);
    if (type === 'rgRow') {
      this.dimensionProvider.setData(getVisibleSourceItem(store.store).length, type);
    }
  }
}
