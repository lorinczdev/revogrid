/*!
 * Built by Revolist
 */
import { h } from "@stencil/core";
import { HEADER_CLASS, MIN_COL_SIZE } from "../../utils/consts";
import { HeaderCellRenderer } from "../../components/header/headerCellRenderer";
const GroupHeaderRenderer = (p) => {
  const groupProps = {
    canResize: p.canResize,
    minWidth: p.group.ids.length * MIN_COL_SIZE,
    maxWidth: 0,
    active: p.active || ['r'],
    class: {
      [HEADER_CLASS]: true,
    },
    style: {
      transform: `translateX(${p.start}px)`,
      width: `${p.end - p.start}px`,
    },
    onResize: p.onResize,
  };
  return (h(HeaderCellRenderer, { data: Object.assign(Object.assign({}, p.group), { prop: '', providers: p.providers, index: p.start }), props: groupProps, additionalData: p.additionalData }));
};
export default GroupHeaderRenderer;
//# sourceMappingURL=headerGroupRenderer.js.map
