/*!
 * Built by Revolist
 */
export function dispatchElement(target, eventName, detail) {
  const event = new CustomEvent(eventName, {
    detail,
    cancelable: true,
    bubbles: true,
  });
  target === null || target === void 0 ? void 0 : target.dispatchEvent(event);
  return event;
}
export function dispatch(e, eventName, detail) {
  e.preventDefault();
  return dispatchElement(e.target, eventName, detail);
}
/**
 * Base layer for plugins
 * Provide minimal starting core
 */
export default class BasePlugin {
  constructor(revogrid) {
    this.revogrid = revogrid;
    this.subscriptions = {};
  }
  /**
   *
   * @param eventName - event name to subscribe to in revo-grid
   * @param callback - callback function for event
   */
  addEventListener(eventName, callback) {
    this.revogrid.addEventListener(eventName, callback);
    this.subscriptions[eventName] = callback;
  }
  /**
   * Subscribe to grid properties to watch changes
   * You can return false in callback to prevent default value set
   *
   * @param prop - property name
   * @param callback - callback function
   * @param immediate - trigger callback immediately with current value
   */
  watch(prop, callback, { immediate } = { immediate: false }) {
    const nativeValueDesc = Object.getOwnPropertyDescriptor(this.revogrid, prop) ||
      Object.getOwnPropertyDescriptor(this.revogrid.constructor.prototype, prop);
    // Overwrite property descriptor for this instance
    Object.defineProperty(this.revogrid, prop, {
      set(val) {
        var _a;
        const keepDefault = callback(val);
        if (keepDefault === false) {
          return;
        }
        // Continue with native behavior
        return (_a = nativeValueDesc === null || nativeValueDesc === void 0 ? void 0 : nativeValueDesc.set) === null || _a === void 0 ? void 0 : _a.call(this, val);
      },
      get() {
        var _a;
        // Continue with native behavior
        return (_a = nativeValueDesc === null || nativeValueDesc === void 0 ? void 0 : nativeValueDesc.get) === null || _a === void 0 ? void 0 : _a.call(this);
      },
    });
    if (immediate) {
      callback(nativeValueDesc === null || nativeValueDesc === void 0 ? void 0 : nativeValueDesc.value);
    }
  }
  /**
   * Remove event subscription
   * @param eventName
   */
  removeEventListener(eventName) {
    this.revogrid.removeEventListener(eventName, this.subscriptions[eventName]);
    delete this.subscriptions[eventName];
  }
  /**
   * Trigger event to grid upper level
   * Event can be cancelled
   * @param eventName
   * @param detail
   * @returns event
   */
  emit(eventName, detail) {
    const event = new CustomEvent(eventName, { detail, cancelable: true });
    this.revogrid.dispatchEvent(event);
    return event;
  }
  /**
   * Clearing inner subscription
   */
  clearSubscriptions() {
    for (let type in this.subscriptions) {
      this.removeEventListener(type);
    }
  }
  /**
   * Minimal destroy implementations
   */
  destroy() {
    this.clearSubscriptions();
  }
}
//# sourceMappingURL=basePlugin.js.map
