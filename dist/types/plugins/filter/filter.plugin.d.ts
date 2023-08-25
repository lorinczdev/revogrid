import BasePlugin from '../basePlugin';
import { RevoGrid } from '../../interfaces';
import { MultiFilterItem } from './filter.pop';
import { FilterType } from './filter.service';
import { LogicFunction } from './filter.types';
type CustomFilter = {
  columnFilterType: string;
  name: string;
  func: LogicFunction;
};
export type FilterCaptions = {
  title: string;
  save: string;
  reset: string;
  cancel: string;
};
export type FilterLocalization = {
  captions: FilterCaptions;
  filterNames: Record<FilterType, string>;
};
/**
 * @typedef ColumnFilterConfig
 * @type {object}
 * @property {FilterCollection|undefined} collection - preserved filter data
 * @property {string[]|undefined} include - filters to be included, if defined everything else out of scope will be ignored
 * @property {Record<string, CustomFilter>|undefined} customFilters - hash map of {FilterType:CustomFilter}.
 * @property {FilterLocalization|undefined} localization - translation for filter popup captions.
 * @property {MultiFilterItem|undefined} multiFilterItems - data for multi filtering.
 * @property {boolean|undefined} disableDynamicFiltering - disables dynamic filtering.
 * A way to define your own filter types per column
 */
export type ColumnFilterConfig = {
  collection?: FilterCollection;
  include?: string[];
  customFilters?: Record<string, CustomFilter>;
  filterProp?: string;
  localization?: FilterLocalization;
  multiFilterItems?: MultiFilterItem;
  disableDynamicFiltering?: boolean;
};
type FilterCollectionItem = {
  filter: LogicFunction;
  type: FilterType;
  value?: any;
};
export type FilterCollection = Record<RevoGrid.ColumnProp, FilterCollectionItem>;
export declare const FILTER_TRIMMED_TYPE = "filter";
export declare const FILTER_CONFIG_CHANGED_EVENT = "filterconfigchanged";
export default class FilterPlugin extends BasePlugin {
  protected revogrid: HTMLRevoGridElement;
  private pop;
  private filterCollection;
  private multiFilterItems;
  private possibleFilters;
  private possibleFilterNames;
  private possibleFilterEntities;
  private filterProp;
  constructor(revogrid: HTMLRevoGridElement, uiid: string, config?: ColumnFilterConfig);
  private initConfig;
  private headerclick;
  private getColumnFilter;
  private isValidType;
  private onFilterChange;
  /**
   * Triggers grid filtering
   */
  doFiltering(collection: FilterCollection, items: RevoGrid.DataType[], columns: RevoGrid.ColumnRegular[], filterItems: MultiFilterItem): Promise<void>;
  clearFiltering(): Promise<void>;
  private runFiltering;
  private getData;
  private getRowFilter;
}
export {};
