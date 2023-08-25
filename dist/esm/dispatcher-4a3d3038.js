/*!
 * Built by Revolist
 */
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

export { dispatch as d };

//# sourceMappingURL=dispatcher-4a3d3038.js.map