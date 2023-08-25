import fill from 'lodash/fill';
import { RevoGrid } from '../../interfaces';
import { Group, Groups } from '../../store/dataSource/data.store';
import { ColSource, CSVFormat, DataInput, Formatter } from './types';

import { columnTypes, rowTypes } from '../../store/storeTypes';
import { timeout } from '../../utils';
import BasePlugin from '../basePlugin';
import ExportCsv from './csv';

enum ExportTypes {
  csv = 'csv',
}

export type ExportFormat = Partial<CSVFormat>;

export default class ExportFilePlugin extends BasePlugin {
  /** Exports string */
  async exportString(options: ExportFormat = {}, t: ExportTypes = ExportTypes.csv) {
    const data = await this.beforeexport();
    if (!data) {
      return null;
    }
    return this.formatter(t, options).doExport(data);
  }

  /** Exports Blob */
  async exportBlob(options: ExportFormat = {}, t: ExportTypes = ExportTypes.csv) {
    return await this.getBlob(this.formatter(t, options));
  }

  /** Export file */
  async exportFile(options: ExportFormat = {}, t: ExportTypes = ExportTypes.csv) {
    const formatter = this.formatter(t, options);
    const blob = await this.getBlob(formatter);

    // url
    const URL = window.URL || window.webkitURL;

    const a = document.createElement('a');
    const { filename, fileKind } = formatter.options;
    const name = `${filename}.${fileKind}`;
    const url = URL.createObjectURL(blob);

    a.style.display = 'none';
    a.setAttribute('href', url);
    a.setAttribute('download', name);
    this.revogrid.appendChild(a);
    a.dispatchEvent(new MouseEvent('click'));
    this.revogrid.removeChild(a);

    // delay for revoke, correct for some browsers
    await timeout(120);
    URL.revokeObjectURL(url);
  }

  /** Blob object */
  async getBlob(formatter: Formatter) {
    const type = `${formatter.options.mime};charset=${formatter.options.encoding}`;
    if (typeof Blob !== 'undefined') {
      const data = await this.beforeexport();
      if (!data) {
        return null;
      }
      return new Blob([formatter.doExport(data)], { type });
    }
    return null;
  }

  // before event
  private async beforeexport() {
    let data = await this.getData();
    const event: CustomEvent<{ data: DataInput }> = this.emit('beforeexport', { data });
    if (event.defaultPrevented) {
      return null;
    }
    return event.detail.data;
  }

  private async getData(): Promise<DataInput> {
    const data = await this.getSource();
    const colSource: ColSource[] = [];
    const colPromises: Promise<ColSource>[] = [];
    columnTypes.forEach((t, i) => {
      colPromises.push(this.getColPerSource(t).then(s => (colSource[i] = s)));
    });
    await Promise.all(colPromises);
    const columns: ColSource = {
      headers: [],
      props: [],
    };
    for (let source of colSource) {
      source.headers.forEach((h, i) => {
        if (!columns.headers[i]) {
          columns.headers[i] = [];
        }
        columns.headers[i].push(...h);
      });
      columns.props.push(...source.props);
    }
    return {
      data,
      ...columns,
    };
  }

  private async getColPerSource(t: RevoGrid.DimensionCols) {
    const store = await this.revogrid.getColumnStore(t);
    const source = store.get('source');
    const virtualIndexes = store.get('items');
    const depth = store.get('groupingDepth');
    const groups = store.get('groups');
    const colNames: string[] = [];
    const colProps: RevoGrid.ColumnProp[] = [];
    const visibleItems = virtualIndexes.reduce((r: Record<string, number>, v, virtualIndex) => {
      const prop = source[v].prop;
      colNames.push(source[v].name || '');
      colProps.push(prop);
      r[prop] = virtualIndex;
      return r;
    }, {});
    const rows: string[][] = this.getGroupHeaders(depth, groups, virtualIndexes, visibleItems);
    rows.push(colNames);
    return {
      headers: rows,
      props: colProps,
    };
  }

  private getGroupHeaders(depth: number, groups: Groups, items: number[], visibleItems: Record<string, number>) {
    const rows: string[][] = [];
    const template = fill(new Array(items.length), '');
    for (let d = 0; d < depth; d++) {
      const rgRow = [...template];
      rows.push(rgRow);
      if (!groups[d]) {
        continue;
      }
      const levelGroups = groups[d];

      // add names of groups
      levelGroups.forEach((group: Group) => {
        const minIndex = this.findGroupStartIndex(group.ids, visibleItems);
        if (typeof minIndex === 'number') {
          rgRow[minIndex] = group.name;
        }
      });
    }
    return rows;
  }

  private findGroupStartIndex(ids: (string | number)[], visibleItems: Record<string, number>): number | undefined {
    let min: number | undefined;
    ids.forEach(id => {
      const current = visibleItems[id];
      if (typeof current === 'number') {
        if (typeof min !== 'number' || min > current) {
          min = current;
        }
      }
    });
    return min;
  }

  private async getSource() {
    const data: RevoGrid.DataType[][] = [];
    const promisesData: Promise<number>[] = [];
    rowTypes.forEach(t => {
      const dataPart: RevoGrid.DataType[] = [];
      data.push(dataPart);
      const promise = this.revogrid.getVisibleSource(t).then((d: RevoGrid.DataType[]) => dataPart.push(...d));
      promisesData.push(promise);
    });
    await Promise.all(promisesData);
    return data.reduce((r, v) => {
      r.push(...v);
      return r;
    }, []);
  }

  // get correct class for future multiple types support
  private formatter(type: ExportTypes, options: ExportFormat = {}) {
    switch (type) {
      case ExportTypes.csv:
        return new ExportCsv(options);
      default:
        throw new Error('Unknown format');
    }
  }
}
