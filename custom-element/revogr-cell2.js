/*!
 * Built by Revolist
 */
import { h, proxyCustomElement, HTMLElement, createEvent, Host } from '@stencil/core/internal/client';
import { D as DATA_ROW, a as DRAGGABLE_CLASS, b as DRAG_ICON_CLASS, c as DATA_COL } from './consts.js';
import { C as ColumnService } from './columnService.js';

const PADDING_DEPTH = 10;
const RowRenderer = ({ rowClass, index, size, start, depth }, cells) => {
  const props = Object.assign({ [DATA_ROW]: index });
  return (h("div", Object.assign({}, props, { class: `rgRow ${rowClass || ''}`, style: {
      height: `${size}px`,
      transform: `translateY(${start}px)`,
      paddingLeft: depth ? `${PADDING_DEPTH * depth}px` : undefined,
    } }), cells));
};

const RevogridCellRenderer = /*@__PURE__*/ proxyCustomElement(class RevogridCellRenderer extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.beforeCellRender = createEvent(this, "before-cell-render", 7);
    this.dragStartCell = createEvent(this, "dragStartCell", 7);
    this.additionalData = undefined;
    this.columnService = undefined;
    this.providers = undefined;
    this.depth = undefined;
    this.rowIndex = undefined;
    this.rowStart = undefined;
    this.rowEnd = undefined;
    this.rowSize = undefined;
    this.colIndex = undefined;
    this.colStart = undefined;
    this.colEnd = undefined;
    this.colSize = undefined;
  }
  render() {
    var _a;
    const model = this.columnService.rowDataModel(this.rowIndex, this.colIndex);
    const cellEvent = this.beforeCellRender.emit({
      column: {
        itemIndex: this.colIndex,
        start: this.colStart,
        end: this.colEnd,
        size: this.colSize,
      },
      row: {
        itemIndex: this.rowIndex,
        start: this.rowStart,
        end: this.rowEnd,
        size: this.rowSize,
      },
      model,
      rowType: this.providers.type,
      colType: this.columnService.type,
    });
    if (cellEvent.defaultPrevented) {
      return;
    }
    const { detail: { column: columnProps, row: rowProps }, } = cellEvent;
    const defaultProps = {
      [DATA_COL]: columnProps.itemIndex,
      [DATA_ROW]: rowProps.itemIndex,
      style: {
        width: `${columnProps.size}px`,
        transform: `translateX(${columnProps.start}px)`,
        height: rowProps.size ? `${rowProps.size}px` : undefined,
      },
    };
    /**
     * For grouping, can be removed in the future and replaced with event
     */
    if (this.depth && !columnProps.itemIndex) {
      defaultProps.style.paddingLeft = `${PADDING_DEPTH * this.depth}px`;
    }
    const props = this.columnService.mergeProperties(rowProps.itemIndex, columnProps.itemIndex, defaultProps);
    const tpl = (_a = this.columnService.columns[columnProps.itemIndex]) === null || _a === void 0 ? void 0 : _a.cellTemplate;
    // if custom render
    if (tpl) {
      return (h(Host, Object.assign({}, props), tpl(h, Object.assign(Object.assign({}, model), { providers: this.providers }), this.additionalData)));
    }
    // something is wrong with data
    if (!model.column) {
      console.error('Investigate column problem');
      return;
    }
    const els = [];
    if (model.column.rowDrag && isRowDragService(model.column.rowDrag, model)) {
      els.push(h("span", { class: DRAGGABLE_CLASS, onMouseDown: originalEvent => this.dragStartCell.emit({
          originalEvent,
          model,
        }) }, h("span", { class: DRAG_ICON_CLASS })));
    }
    els.push(`${ColumnService.getData(model.model[model.prop])}`);
    // if regular render
    return h(Host, Object.assign({}, props), els);
  }
}, [0, "revogr-cell", {
    "additionalData": [8, "additional-data"],
    "columnService": [16],
    "providers": [16],
    "depth": [2],
    "rowIndex": [2, "row-index"],
    "rowStart": [2, "row-start"],
    "rowEnd": [2, "row-end"],
    "rowSize": [2, "row-size"],
    "colIndex": [2, "col-index"],
    "colStart": [2, "col-start"],
    "colEnd": [2, "col-end"],
    "colSize": [2, "col-size"]
  }]);
function isRowDragService(rowDrag, model) {
  if (typeof rowDrag === 'function') {
    return rowDrag(model);
  }
  return !!rowDrag;
}
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["revogr-cell"];
  components.forEach(tagName => { switch (tagName) {
    case "revogr-cell":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, RevogridCellRenderer);
      }
      break;
  } });
}

export { RevogridCellRenderer as R, RowRenderer as a, defineCustomElement as d };

//# sourceMappingURL=revogr-cell2.js.map