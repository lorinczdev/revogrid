import { Observable, PluginSubscribe } from '../../interfaces';
import { DataSourceState } from './data.store';
export type TrimmedEntity = Record<number, boolean>;
export type Trimmed = Record<string, TrimmedEntity>;
/**
 * Hide items from main collection
 * But keep them in store
 */
export declare const trimmedPlugin: <T>(store: Observable<DataSourceState<T, any>>) => PluginSubscribe<DataSourceState<T, any>>;
export declare function gatherTrimmedItems(trimmedItems: Trimmed): TrimmedEntity;
