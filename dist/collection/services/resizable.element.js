/*!
 * Built by Revolist
 */
import { h } from "@stencil/core";
import { ResizeDirective, ResizeEvents } from "./resizable.directive";
export const ResizableElement = (props, children) => {
  const resizeEls = [];
  const directive = (props.canResize &&
    new ResizeDirective(props, e => {
      if (e.eventName === ResizeEvents.end) {
        props.onResize && props.onResize(e);
      }
    })) ||
    null;
  if (props.canResize) {
    if (props.active) {
      for (let p in props.active) {
        resizeEls.push(h("div", { onClick: e => e.preventDefault(), onDblClick: e => {
            var _a;
            e.preventDefault();
            (_a = props.onDoubleClick) === null || _a === void 0 ? void 0 : _a.call(props, e);
          }, onMouseDown: (e) => directive === null || directive === void 0 ? void 0 : directive.handleDown(e), onTouchStart: (e) => directive === null || directive === void 0 ? void 0 : directive.handleDown(e), class: `resizable resizable-${props.active[p]}` }));
      }
    }
  }
  else {
    if (props.active) {
      for (let p in props.active) {
        resizeEls.push(h("div", { onClick: e => e.preventDefault(), onTouchStart: (e) => e.preventDefault(), onDblClick: e => {
            var _a;
            e.preventDefault();
            (_a = props.onDoubleClick) === null || _a === void 0 ? void 0 : _a.call(props, e);
          }, class: `no-resize resizable resizable-${props.active[p]}` }));
      }
    }
  }
  return (h("div", Object.assign({}, props, { ref: (e) => directive === null || directive === void 0 ? void 0 : directive.set(e) }), children, resizeEls));
};
//# sourceMappingURL=resizable.element.js.map
