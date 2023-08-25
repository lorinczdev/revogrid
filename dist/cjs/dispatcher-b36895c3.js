/*!
 * Built by Revolist
 */
'use strict';

/**
 * Dispatch custom event to element
 */
function dispatch(target, eventName, detail) {
  const event = new CustomEvent(eventName, {
    detail,
    cancelable: true,
    bubbles: true,
  });
  target === null || target === void 0 ? void 0 : target.dispatchEvent(event);
  return event;
}

exports.dispatch = dispatch;

//# sourceMappingURL=dispatcher-b36895c3.js.map