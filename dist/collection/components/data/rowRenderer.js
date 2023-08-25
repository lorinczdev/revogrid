/*!
 * Built by Revolist
 */
import { h } from "@stencil/core";
import { DATA_ROW } from "../../utils/consts";
export const PADDING_DEPTH = 10;
const RowRenderer = ({ rowClass, index, size, start, depth }, cells) => {
  const props = Object.assign({ [DATA_ROW]: index });
  return (h("div", Object.assign({}, props, { class: `rgRow ${rowClass || ''}`, style: {
      height: `${size}px`,
      transform: `translateY(${start}px)`,
      paddingLeft: depth ? `${PADDING_DEPTH * depth}px` : undefined,
    } }), cells));
};
export default RowRenderer;
//# sourceMappingURL=rowRenderer.js.map
