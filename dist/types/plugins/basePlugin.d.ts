import { RevoPlugin, RevoGrid } from '../interfaces';
type DispatchDetail = RevoGrid.ColumnRegular | RevoGrid.ColumnTemplateProp;
type Target = HTMLElement | null;
type Event = {
  target: HTMLElement | null;
  preventDefault(): void;
};
type WatchConfig = {
  immediate: boolean;
};
export declare function dispatchElement(target: Target, eventName: string, detail: DispatchDetail): CustomEvent;
export declare function dispatch(e: Event, eventName: string, detail: DispatchDetail): CustomEvent;
/**
 * Base layer for plugins
 * Provide minimal starting core
 */
export default abstract class BasePlugin implements RevoPlugin.Plugin {
  protected revogrid: HTMLRevoGridElement;
  protected readonly subscriptions: Record<string, (e?: any) => void>;
  constructor(revogrid: HTMLRevoGridElement);
  /**
   *
   * @param eventName - event name to subscribe to in revo-grid
   * @param callback - callback function for event
   */
  protected addEventListener(eventName: string, callback: (e: CustomEvent) => void): void;
  /**
   * Subscribe to grid properties to watch changes
   * You can return false in callback to prevent default value set
   *
   * @param prop - property name
   * @param callback - callback function
   * @param immediate - trigger callback immediately with current value
   */
  protected watch<T extends any>(prop: string, callback: (arg: T) => boolean | void, { immediate }?: Partial<WatchConfig>): void;
  /**
   * Remove event subscription
   * @param eventName
   */
  protected removeEventListener(eventName: string): void;
  /**
   * Trigger event to grid upper level
   * Event can be cancelled
   * @param eventName
   * @param detail
   * @returns event
   */
  protected emit(eventName: string, detail?: any): CustomEvent<any>;
  /**
   * Clearing inner subscription
   */
  protected clearSubscriptions(): void;
  /**
   * Minimal destroy implementations
   */
  destroy(): void;
}
export {};
