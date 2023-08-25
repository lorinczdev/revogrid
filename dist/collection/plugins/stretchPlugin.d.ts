import { RevoPlugin } from '../interfaces';
import ColumnDataProvider from '../services/column.data.provider';
import { DataProvider } from '../services/data.provider';
import DimensionProvider, { ColumnItems } from '../services/dimension.provider';
import BasePlugin from './basePlugin';
type Providers = {
  dataProvider: DataProvider;
  dimensionProvider: DimensionProvider;
  columnProvider: ColumnDataProvider;
};
export default class StretchColumn extends BasePlugin {
  protected providers: Providers;
  private stretchedColumn;
  private readonly scrollSize;
  constructor(revogrid: HTMLRevoGridElement, providers: Providers);
  private setScroll;
  private activateChanges;
  private dropChanges;
  private apply;
  /**
   * Apply stretch changes
   */
  applyStretch(columns: ColumnItems): void;
}
/**
 * Check plugin type is Stretch
 */
export declare function isStretchPlugin(plugin: RevoPlugin.Plugin | StretchColumn): plugin is StretchColumn;
export {};
