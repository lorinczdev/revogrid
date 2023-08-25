/*!
 * Built by Revolist
 */
import { h, r as registerInstance, c as createEvent, H as Host, g as getElement } from './index-7fd83173.js';
import { K as DATA_ROW, L as DRAG_ICON_CLASS, N as DRAGGABLE_CLASS, O as DATA_COL, P as ROW_FOCUSED_CLASS, g as getSourceItem, Q as _getNative, a as _baseEach, _ as _baseIteratee, b as isArray_1, F as FOCUS_CLASS, V as HEADER_CLASS, W as HEADER_SORTABLE_CLASS, X as MIN_COL_SIZE, f as findIndex_1, n as getItemByIndex, Y as HEADER_ROW_CLASS, Z as HEADER_ACTUAL_ROW_CLASS, e as each } from './index-a937c03b.js';
import { C as ColumnService, L as LocalScrollService } from './localScrollService-9c3949fd.js';
import { p as GROUP_EXPAND_BTN, h as GROUP_EXPAND_EVENT, q as PSEUDO_GROUP_ITEM, G as GROUP_EXPANDED, c as GROUP_DEPTH, i as isGrouping, H as HEADER_SLOT, C as CONTENT_SLOT, F as FOOTER_SLOT } from './viewport.helpers-b34b34b0.js';
import { a as FilterButton } from './filter.button-143a6a60.js';
import { d as dispatch } from './dispatcher-4a3d3038.js';
import { d as debounce_1, e as isObject_1 } from './debounce-48584128.js';

const PADDING_DEPTH = 10;
const RowRenderer = ({ rowClass, index, size, start, depth }, cells) => {
  const props = Object.assign({ [DATA_ROW]: index });
  return (h("div", Object.assign({}, props, { class: `rgRow ${rowClass || ''}`, style: {
      height: `${size}px`,
      transform: `translateY(${start}px)`,
      paddingLeft: depth ? `${PADDING_DEPTH * depth}px` : undefined,
    } }), cells));
};

const RevogridCellRenderer = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
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
};
function isRowDragService(rowDrag, model) {
  if (typeof rowDrag === 'function') {
    return rowDrag(model);
  }
  return !!rowDrag;
}

function expandEvent(e, model, virtualIndex) {
  const event = new CustomEvent(GROUP_EXPAND_EVENT, {
    detail: {
      model,
      virtualIndex,
    },
    cancelable: true,
    bubbles: true,
  });
  e.target.dispatchEvent(event);
}
const GroupingRowRenderer = (props) => {
  const { model, itemIndex, hasExpand, groupingCustomRenderer } = props;
  const name = model[PSEUDO_GROUP_ITEM];
  const expanded = model[GROUP_EXPANDED];
  const depth = parseInt(model[GROUP_DEPTH], 10) || 0;
  if (!hasExpand) {
    return h(RowRenderer, Object.assign({}, props, { rowClass: "groupingRow", depth: depth }));
  }
  if (groupingCustomRenderer) {
    return (h(RowRenderer, Object.assign({}, props, { rowClass: "groupingRow", depth: depth }),
      h("div", { onClick: e => expandEvent(e, model, itemIndex) }, groupingCustomRenderer(h, { name, itemIndex, expanded, depth }))));
  }
  return (h(RowRenderer, Object.assign({}, props, { rowClass: "groupingRow", depth: depth }),
    h("button", { class: { [GROUP_EXPAND_BTN]: true }, onClick: e => expandEvent(e, model, itemIndex) },
      h("svg", { "aria-hidden": "true", style: { transform: `rotate(${!expanded ? -90 : 0}deg)` }, focusable: "false", viewBox: "0 0 448 512" },
        h("path", { fill: "currentColor", d: "M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" }))),
    name));
};

const revogrDataStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}revogr-data{display:block;width:100%;position:relative}revogr-data .rgRow{position:absolute;width:100%;left:0}revogr-data .rgRow.groupingRow{font-weight:600}revogr-data .rgRow.groupingRow .group-expand{width:25px;height:100%;max-height:25px;margin-right:2px;background-color:transparent;border-color:transparent}revogr-data .rgRow.groupingRow .group-expand svg{width:7px}revogr-data .revo-draggable{border:none;height:32px;display:inline-flex;outline:0;padding:0;font-size:0.8125rem;box-sizing:border-box;align-items:center;white-space:nowrap;vertical-align:middle;justify-content:center;text-decoration:none;width:24px;height:100%;cursor:pointer}revogr-data .revo-draggable>.revo-drag-icon{vertical-align:middle;display:inline-block;pointer-events:none;transition:background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms}revogr-data .rgCell{top:0;position:absolute;box-sizing:border-box;height:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}revogr-data .rgCell.align-center{text-align:center}revogr-data .rgCell.align-left{text-align:left}revogr-data .rgCell.align-right{text-align:right}";

const RevogrData = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.beforeRowRender = createEvent(this, "beforeRowRender", 7);
    this.afterrender = createEvent(this, "afterrender", 7);
    this.renderedRows = new Map();
    this.currentRange = null;
    this.readonly = undefined;
    this.range = undefined;
    this.rowClass = undefined;
    this.additionalData = undefined;
    this.rowSelectionStore = undefined;
    this.viewportRow = undefined;
    this.viewportCol = undefined;
    this.dimensionRow = undefined;
    this.colData = undefined;
    this.dataStore = undefined;
    this.type = undefined;
    this.providers = undefined;
  }
  onStoreChange() {
    var _a, _b;
    (_a = this.columnService) === null || _a === void 0 ? void 0 : _a.destroy();
    this.columnService = new ColumnService(this.dataStore, this.colData);
    // make sure we have correct data, before render
    this.providers = {
      type: this.type,
      data: this.dataStore,
      viewport: this.viewportCol,
      dimension: this.dimensionRow,
      selection: this.rowSelectionStore,
    };
    (_b = this.rangeUnsubscribe) === null || _b === void 0 ? void 0 : _b.call(this);
    this.rangeUnsubscribe = this.rowSelectionStore.onChange('range', e => {
      // clear prev range
      if (this.currentRange) {
        this.renderedRows.forEach((row, y) => {
          // skip current range
          if (e && y >= e.y && y <= e.y1) {
            return;
          }
          if (row &&
            row.$elm$ instanceof HTMLElement &&
            row.$elm$.classList.contains(ROW_FOCUSED_CLASS)) {
            row.$elm$.classList.remove(ROW_FOCUSED_CLASS);
          }
        });
      }
      // apply new range
      if (e) {
        for (let y = e.y; y <= e.y1; y++) {
          const row = this.renderedRows.get(y);
          if (row &&
            row.$elm$ instanceof HTMLElement &&
            !row.$elm$.classList.contains(ROW_FOCUSED_CLASS)) {
            row.$elm$.classList.add(ROW_FOCUSED_CLASS);
          }
        }
      }
      this.currentRange = e;
    });
  }
  connectedCallback() {
    this.onStoreChange();
  }
  disconnectedCallback() {
    var _a, _b;
    (_a = this.columnService) === null || _a === void 0 ? void 0 : _a.destroy();
    (_b = this.rangeUnsubscribe) === null || _b === void 0 ? void 0 : _b.call(this);
  }
  componentDidRender() {
    this.afterrender.emit({ type: this.type });
  }
  render() {
    this.renderedRows = new Map();
    const rows = this.viewportRow.get('items');
    const cols = this.viewportCol.get('items');
    if (!this.columnService.columns.length || !rows.length || !cols.length) {
      return '';
    }
    const rowsEls = [];
    const depth = this.dataStore.get('groupingDepth');
    const groupingCustomRenderer = this.dataStore.get('groupingCustomRenderer');
    for (let rgRow of rows) {
      const dataItem = getSourceItem(this.dataStore, rgRow.itemIndex);
      /** grouping */
      if (isGrouping(dataItem)) {
        rowsEls.push(h(GroupingRowRenderer, Object.assign({}, rgRow, { index: rgRow.itemIndex, model: dataItem, groupingCustomRenderer: groupingCustomRenderer, hasExpand: this.columnService.hasGrouping })));
        continue;
      }
      /** grouping end */
      const cells = [];
      let rowClass = this.rowClass
        ? this.columnService.getRowClass(rgRow.itemIndex, this.rowClass)
        : '';
      // highlight row if it is in range
      if (this.currentRange &&
        rgRow.itemIndex >= this.currentRange.y &&
        rgRow.itemIndex <= this.currentRange.y1) {
        rowClass += ` ${ROW_FOCUSED_CLASS}`;
      }
      for (let rgCol of cols) {
        cells.push(h("revogr-cell", { additionalData: this.additionalData, columnService: this.columnService, providers: this.providers, depth: this.columnService.hasGrouping ? depth : 0, rowIndex: rgRow.itemIndex, rowStart: rgRow.start, rowEnd: rgRow.end, rowSize: rgRow.size, colIndex: rgCol.itemIndex, colStart: rgCol.start, colEnd: rgCol.end, colSize: rgCol.size }));
      }
      const row = (h(RowRenderer, { index: rgRow.itemIndex, rowClass: rowClass, size: rgRow.size, start: rgRow.start }, cells));
      this.beforeRowRender.emit({
        node: row,
        item: rgRow,
        dataItem,
      });
      rowsEls.push(row);
      this.renderedRows.set(rgRow.itemIndex, row);
    }
    return (h(Host, null, h("slot", null), rowsEls));
  }
  get element() { return getElement(this); }
  static get watchers() { return {
    "dataStore": ["onStoreChange"],
    "colData": ["onStoreChange"]
  }; }
};
RevogrData.style = revogrDataStyleCss;

var defineProperty = (function() {
  try {
    var func = _getNative(Object, 'defineProperty');
    func({}, '', {});
    return func;
  } catch (e) {}
}());

var _defineProperty = defineProperty;

/**
 * The base implementation of `assignValue` and `assignMergeValue` without
 * value checks.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function baseAssignValue(object, key, value) {
  if (key == '__proto__' && _defineProperty) {
    _defineProperty(object, key, {
      'configurable': true,
      'enumerable': true,
      'value': value,
      'writable': true
    });
  } else {
    object[key] = value;
  }
}

var _baseAssignValue = baseAssignValue;

/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array == null ? 0 : array.length;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

var _arrayAggregator = arrayAggregator;

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  _baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

var _baseAggregator = baseAggregator;

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray_1(collection) ? _arrayAggregator : _baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, _baseIteratee(iteratee), accumulator);
  };
}

var _createAggregator = createAggregator;

/**
 * Creates an object composed of keys generated from the results of running
 * each element of `collection` thru `iteratee`. The corresponding value of
 * each key is the last element responsible for generating the key. The
 * iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The iteratee to transform keys.
 * @returns {Object} Returns the composed aggregate object.
 * @example
 *
 * var array = [
 *   { 'dir': 'left', 'code': 97 },
 *   { 'dir': 'right', 'code': 100 }
 * ];
 *
 * _.keyBy(array, function(o) {
 *   return String.fromCharCode(o.code);
 * });
 * // => { 'a': { 'dir': 'left', 'code': 97 }, 'd': { 'dir': 'right', 'code': 100 } }
 *
 * _.keyBy(array, 'dir');
 * // => { 'left': { 'dir': 'left', 'code': 97 }, 'right': { 'dir': 'right', 'code': 100 } }
 */
var keyBy = _createAggregator(function(result, value, key) {
  _baseAssignValue(result, key, value);
});

var keyBy_1 = keyBy;

const SortingSign = ({ column }) => {
  var _a;
  return h("i", { class: (_a = column === null || column === void 0 ? void 0 : column.order) !== null && _a !== void 0 ? _a : 'sort-off' });
};

var ResizeEvents;
(function (ResizeEvents) {
  ResizeEvents["start"] = "resize:start";
  ResizeEvents["move"] = "resize:move";
  ResizeEvents["end"] = "resize:end";
})(ResizeEvents || (ResizeEvents = {}));
const RESIZE_MASK = {
  'resizable-r': { bit: 0b0001, cursor: 'ew-resize' },
  'resizable-rb': { bit: 0b0011, cursor: 'se-resize' },
  'resizable-b': { bit: 0b0010, cursor: 's-resize' },
  'resizable-lb': { bit: 0b0110, cursor: 'sw-resize' },
  'resizable-l': { bit: 0b0100, cursor: 'w-resize' },
  'resizable-lt': { bit: 0b1100, cursor: 'nw-resize' },
  'resizable-t': { bit: 0b1000, cursor: 'n-resize' },
  'resizable-rt': { bit: 0b1001, cursor: 'ne-resize' },
};
const DISABLE_MASK = {
  l: 0b0001,
  t: 0b0010,
  w: 0b0100,
  h: 0b1000,
};
const defaultProps = (props) => {
  return Object.assign(Object.assign({}, props), { fitParent: props.fitParent || false, active: props.active || [], disableAttributes: props.disableAttributes || [], minWidth: props.minWidth || 0, minHeight: props.minHeight || 0 });
};
class ResizeDirective {
  constructor(initialProps, $event) {
    this.initialProps = initialProps;
    this.$event = $event;
    this.mouseX = 0;
    this.mouseY = 0;
    this.width = 0;
    this.height = 0;
    this.changeX = 0;
    this.changeY = 0;
    this.disableCalcMap = 0b1111;
    this.props = defaultProps(initialProps);
    this.mouseMoveFunc = this.handleMove.bind(this);
    this.mouseUpFunc = this.handleUp.bind(this);
    this.minW = this.props.minWidth;
    this.minH = this.props.minHeight;
    this.maxW = this.props.maxWidth;
    this.maxH = this.props.maxHeight;
    this.parent = { width: 0, height: 0 };
    this.resizeState = 0;
  }
  set($el) {
    this.$el = $el;
    this.props.disableAttributes.forEach(attr => {
      switch (attr) {
        case 'l':
          this.disableCalcMap &= ~DISABLE_MASK.l;
          break;
        case 't':
          this.disableCalcMap &= ~DISABLE_MASK.t;
          break;
        case 'w':
          this.disableCalcMap &= ~DISABLE_MASK.w;
          break;
        case 'h':
          this.disableCalcMap &= ~DISABLE_MASK.h;
      }
    });
  }
  emitEvent(eventName, additionalOptions) {
    var _a;
    if (!this.$event) {
      return;
    }
    const isLeft = (_a = this.activeResizer) === null || _a === void 0 ? void 0 : _a.classList.contains('resizable-l');
    this.$event(Object.assign({ eventName, width: this.width + this.changeX * (isLeft ? -1 : 1), height: this.height + this.changeY, changedX: this.changeX, changedY: this.changeY }, additionalOptions));
  }
  static isTouchEvent(e) {
    var _a;
    const event = e;
    return ((_a = event.touches) === null || _a === void 0 ? void 0 : _a.length) >= 0;
  }
  handleMove(event) {
    var _a;
    if (!this.resizeState) {
      return;
    }
    let eventY, eventX;
    if (ResizeDirective.isTouchEvent(event)) {
      eventY = event.touches[0].clientY;
      eventX = event.touches[0].clientX;
    }
    else {
      eventY = event.clientY;
      eventX = event.clientX;
    }
    let isX = this.resizeState & RESIZE_MASK['resizable-r'].bit || this.resizeState & RESIZE_MASK['resizable-l'].bit;
    let isY = this.resizeState & RESIZE_MASK['resizable-t'].bit || this.resizeState & RESIZE_MASK['resizable-b'].bit;
    if (isY && this.disableCalcMap & DISABLE_MASK.h) {
      let diffY = eventY - this.mouseY;
      let changedY = this.changeY + diffY;
      const newHeight = this.height + changedY;
      // if overcrossed min height
      if (newHeight < this.minH) {
        changedY = -(this.height - this.minH);
      }
      // if overcrossed max heiht
      if (this.maxH && newHeight > this.maxH) {
        changedY = this.maxH - this.height;
      }
      this.changeY = changedY;
      this.mouseY = eventY;
      if (this.activeResizer) {
        this.activeResizer.style.bottom = `${-this.changeY}px`;
      }
    }
    if (isX && this.disableCalcMap & DISABLE_MASK.w) {
      const isLeft = (_a = this.activeResizer) === null || _a === void 0 ? void 0 : _a.classList.contains('resizable-l');
      let diffX = eventX - this.mouseX;
      let changedX = this.changeX + diffX;
      const newWidth = this.width + changedX * (isLeft ? -1 : 1);
      // if overcrossed min width
      if (newWidth < this.minW) {
        changedX = -(this.width - this.minW);
      }
      // if overcrossed max width
      if (this.maxW && newWidth > this.maxW) {
        changedX = this.maxW - this.width;
      }
      this.changeX = changedX;
      this.mouseX = eventX;
      if (this.activeResizer) {
        if (!isLeft) {
          this.activeResizer.style.right = `${-this.changeX}px`;
        }
        else {
          this.activeResizer.style.left = `${this.changeX}px`;
        }
      }
    }
    this.emitEvent(ResizeEvents.move);
  }
  handleDown(event) {
    if (event.defaultPrevented) {
      return;
    }
    // stop other events if resize in progress
    event.preventDefault();
    this.dropInitial();
    for (let elClass in RESIZE_MASK) {
      const target = event.target;
      if (this.$el.contains(target) && (target === null || target === void 0 ? void 0 : target.classList.contains(elClass))) {
        document.body.style.cursor = RESIZE_MASK[elClass].cursor;
        if (ResizeDirective.isTouchEvent(event)) {
          this.setInitials(event.touches[0], target);
        }
        else {
          event.preventDefault && event.preventDefault();
          this.setInitials(event, target);
        }
        this.resizeState = RESIZE_MASK[elClass].bit;
        const eventName = ResizeEvents.start;
        this.emitEvent(eventName);
        break;
      }
    }
    this.bindMove();
  }
  handleUp(e) {
    e.preventDefault();
    if (this.resizeState !== 0) {
      this.resizeState = 0;
      document.body.style.cursor = '';
      const eventName = ResizeEvents.end;
      this.emitEvent(eventName);
    }
    this.dropInitial();
    this.unbindMove();
  }
  setInitials({ clientX, clientY }, target) {
    const computedStyle = getComputedStyle(this.$el);
    this.$el.classList.add('active');
    this.activeResizer = target;
    if (this.disableCalcMap & DISABLE_MASK.w) {
      this.mouseX = clientX;
      this.width = this.$el.clientWidth;
      this.parent.width = this.$el.parentElement.clientWidth;
      // min width
      const minPaddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
      this.minW = Math.max(minPaddingX, this.initialProps.minWidth || 0);
      // max width
      if (this.initialProps.maxWidth) {
        this.maxW = Math.max(this.width, this.initialProps.maxWidth);
      }
    }
    if (this.disableCalcMap & DISABLE_MASK.h) {
      this.mouseY = clientY;
      this.height = this.$el.clientHeight;
      this.parent.height = this.$el.parentElement.clientHeight;
      // min height
      const minPaddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
      this.minH = Math.max(minPaddingY, this.initialProps.minHeight || 0);
      // max height
      if (this.initialProps.maxHeight) {
        this.maxH = Math.max(this.height, this.initialProps.maxHeight);
      }
    }
  }
  dropInitial() {
    this.changeX = this.changeY = this.minW = this.minH;
    this.width = this.height = 0;
    if (this.activeResizer) {
      this.activeResizer.removeAttribute('style');
    }
    this.$el.classList.remove('active');
    this.activeResizer = null;
  }
  bindMove() {
    document.documentElement.addEventListener('mouseup', this.mouseUpFunc, true);
    document.documentElement.addEventListener('touchend', this.mouseUpFunc, true);
    document.documentElement.addEventListener('mousemove', this.mouseMoveFunc, true);
    document.documentElement.addEventListener('touchmove', this.mouseMoveFunc, true);
    document.documentElement.addEventListener('mouseleave', this.mouseUpFunc);
  }
  unbindMove() {
    document.documentElement.removeEventListener('mouseup', this.mouseUpFunc, true);
    document.documentElement.removeEventListener('touchend', this.mouseUpFunc, true);
    document.documentElement.removeEventListener('mousemove', this.mouseMoveFunc, true);
    document.documentElement.removeEventListener('touchmove', this.mouseMoveFunc, true);
    document.documentElement.removeEventListener('mouseleave', this.mouseUpFunc);
  }
}

const ResizableElement = (props, children) => {
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
  return (h("div", Object.assign({}, props, { ref: (e) => directive === null || directive === void 0 ? void 0 : directive.set(e) }),
    children,
    resizeEls));
};

const ON_COLUMN_CLICK = 'column-click';
const HeaderCellRenderer = ({ data, props, additionalData }, children) => {
  let colTemplate = (data === null || data === void 0 ? void 0 : data.name) || '';
  let cellProps = props;
  if (data === null || data === void 0 ? void 0 : data.columnTemplate) {
    colTemplate = data.columnTemplate(h, data, additionalData);
  }
  if (data === null || data === void 0 ? void 0 : data.columnProperties) {
    const extra = data.columnProperties(data);
    if (extra && typeof extra === 'object') {
      cellProps = ColumnService.doMerge(props, extra);
    }
  }
  return (h(ResizableElement, Object.assign({}, cellProps, { onMouseDown: (e) => {
      dispatch(e.currentTarget, ON_COLUMN_CLICK, {
        data,
        event: e,
      });
    } }),
    h("div", { class: "header-content" }, colTemplate),
    children));
};

const HeaderRenderer = (p) => {
  var _a, _b, _c, _d, _e, _f;
  const cellClass = {
    [HEADER_CLASS]: true,
    [HEADER_SORTABLE_CLASS]: !!((_a = p.data) === null || _a === void 0 ? void 0 : _a.sortable),
  };
  if ((_b = p.data) === null || _b === void 0 ? void 0 : _b.order) {
    cellClass[p.data.order] = true;
  }
  const dataProps = {
    [DATA_COL]: p.column.itemIndex,
    canResize: p.canResize,
    minWidth: ((_c = p.data) === null || _c === void 0 ? void 0 : _c.minSize) || MIN_COL_SIZE,
    maxWidth: (_d = p.data) === null || _d === void 0 ? void 0 : _d.maxSize,
    active: p.active || ['r'],
    class: cellClass,
    style: { width: `${p.column.size}px`, transform: `translateX(${p.column.start}px)` },
    onResize: p.onResize,
    onDoubleClick(originalEvent) {
      p.onDoubleClick({ column: p.data, index: p.column.itemIndex, originalEvent });
    },
    onClick(originalEvent) {
      if (originalEvent.defaultPrevented || !p.onClick) {
        return;
      }
      p.onClick({ column: p.data, index: p.column.itemIndex, originalEvent });
    },
  };
  if (p.range) {
    if (p.column.itemIndex >= p.range.x && p.column.itemIndex <= p.range.x1) {
      if (typeof dataProps.class === 'object') {
        dataProps.class[FOCUS_CLASS] = true;
      }
    }
  }
  return (h(HeaderCellRenderer, { data: p.data, props: dataProps, additionalData: p.additionalData },
    ((_e = p.data) === null || _e === void 0 ? void 0 : _e.order) ? h(SortingSign, { column: p.data }) : '',
    p.canFilter && ((_f = p.data) === null || _f === void 0 ? void 0 : _f.filter) !== false ? h(FilterButton, { column: p.data }) : ''));
};

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

const ColumnGroupsRenderer = ({ additionalData, providers, depth, groups, visibleProps, dimensionCol, canResize, active, onResize }) => {
  // render group columns
  const groupRow = [];
  for (let i = 0; i < depth; i++) {
    if (groups[i]) {
      for (let group of groups[i]) {
        // if group in visible range
        // find first visible group prop in visible columns range
        const indexFirstVisibleCol = findIndex_1(group.ids, id => typeof visibleProps[id] === 'number');
        if (indexFirstVisibleCol > -1) {
          const colVisibleIndex = visibleProps[group.ids[indexFirstVisibleCol]]; // get column index
          const groupStartIndex = colVisibleIndex - indexFirstVisibleCol; // first column index in group
          const groupEndIndex = groupStartIndex + group.ids.length - 1; // last column index in group
          // coordinates
          const groupStart = getItemByIndex(dimensionCol, groupStartIndex).start;
          const groupEnd = getItemByIndex(dimensionCol, groupEndIndex).end;
          groupRow.push(h(GroupHeaderRenderer, { providers: providers, start: groupStart, end: groupEnd, group: group, active: active, canResize: canResize, onResize: e => onResize(e.changedX, groupStartIndex, groupEndIndex), additionalData: additionalData }));
        }
      }
    }
    groupRow.push(h("div", { class: `${HEADER_ROW_CLASS} group` }));
  }
  return groupRow;
};

const revogrHeaderStyleCss = "@charset \"UTF-8\";.revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}revogr-header{position:relative;z-index:5;display:block}revogr-header .rgHeaderCell{display:flex}revogr-header .rgHeaderCell.align-center{text-align:center}revogr-header .rgHeaderCell.align-left{text-align:left}revogr-header .rgHeaderCell.align-right{text-align:right}revogr-header .rgHeaderCell.sortable{cursor:pointer}revogr-header .rgHeaderCell i.asc:after,revogr-header .rgHeaderCell i.desc:after{font-size:13px}revogr-header .rgHeaderCell i.asc:after{content:\"↑\"}revogr-header .rgHeaderCell i.desc:after{content:\"↓\"}revogr-header .rgHeaderCell,revogr-header .grouped-cell{position:absolute;box-sizing:border-box;height:100%;z-index:1}revogr-header .header-rgRow{display:block;position:relative}revogr-header .header-rgRow.group{z-index:0}revogr-header .group-rgRow{position:relative}revogr-header .rgHeaderCell.active{z-index:10}revogr-header .rgHeaderCell.active .resizable{background-color:deepskyblue}revogr-header .rgHeaderCell .header-content{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-grow:1}revogr-header .rgHeaderCell .resizable{display:block;position:absolute;z-index:90;touch-action:none;user-select:none}revogr-header .rgHeaderCell .resizable:hover{background-color:deepskyblue}revogr-header .rgHeaderCell>.resizable-r{cursor:ew-resize;width:6px;right:0;top:0;height:100%}revogr-header .rgHeaderCell>.resizable-rb{cursor:se-resize;width:6px;height:6px;right:0;bottom:0}revogr-header .rgHeaderCell>.resizable-b{cursor:s-resize;height:6px;bottom:0;width:100%;left:0}revogr-header .rgHeaderCell>.resizable-lb{cursor:sw-resize;width:6px;height:6px;left:0;bottom:0}revogr-header .rgHeaderCell>.resizable-l{cursor:w-resize;width:6px;left:0;height:100%;top:0}revogr-header .rgHeaderCell>.resizable-lt{cursor:nw-resize;width:6px;height:6px;left:0;top:0}revogr-header .rgHeaderCell>.resizable-t{cursor:n-resize;height:6px;top:0;width:100%;left:0}revogr-header .rgHeaderCell>.resizable-rt{cursor:ne-resize;width:6px;height:6px;right:0;top:0}revogr-header .rv-filter{visibility:hidden}";

const RevogrHeaderComponent = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.initialHeaderClick = createEvent(this, "initialHeaderClick", 7);
    this.headerresize = createEvent(this, "headerresize", 7);
    this.beforeResize = createEvent(this, "before-resize", 7);
    this.headerdblClick = createEvent(this, "headerdblClick", 7);
    this.viewportCol = undefined;
    this.dimensionCol = undefined;
    this.selectionStore = undefined;
    this.parent = '';
    this.groups = undefined;
    this.groupingDepth = 0;
    this.canResize = undefined;
    this.resizeHandler = undefined;
    this.colData = undefined;
    this.columnFilter = undefined;
    this.type = undefined;
    this.additionalData = {};
  }
  onResize({ width }, index) {
    const col = this.colData[index];
    const event = this.beforeResize.emit([Object.assign(Object.assign({}, col), { size: width || undefined })]);
    if (event.defaultPrevented) {
      return;
    }
    this.headerresize.emit({ [index]: width || 0 });
  }
  onResizeGroup(changedX, startIndex, endIndex) {
    const sizes = {};
    const cols = keyBy_1(this.viewportCol.get('items'), 'itemIndex');
    const change = changedX / (endIndex - startIndex + 1);
    for (let i = startIndex; i <= endIndex; i++) {
      const item = cols[i];
      if (item) {
        sizes[i] = item.size + change;
      }
    }
    this.headerresize.emit(sizes);
  }
  render() {
    var _a;
    const cols = this.viewportCol.get('items');
    const range = (_a = this.selectionStore) === null || _a === void 0 ? void 0 : _a.get('range');
    const cells = [];
    const visibleProps = {};
    // render header columns
    for (let rgCol of cols) {
      const colData = this.colData[rgCol.itemIndex];
      cells.push(h(HeaderRenderer, { range: range, column: rgCol, data: Object.assign(Object.assign({}, colData), { index: rgCol.itemIndex, providers: this.providers }), canFilter: !!this.columnFilter, canResize: this.canResize, active: this.resizeHandler, onResize: e => this.onResize(e, rgCol.itemIndex), onDoubleClick: e => this.headerdblClick.emit(e), onClick: e => this.initialHeaderClick.emit(e), additionalData: this.additionalData }));
      visibleProps[colData === null || colData === void 0 ? void 0 : colData.prop] = rgCol.itemIndex;
    }
    return [
      h("div", { class: "group-rgRow" }, h(ColumnGroupsRenderer, { canResize: this.canResize, active: this.resizeHandler, visibleProps: visibleProps, providers: this.providers, groups: this.groups, dimensionCol: this.dimensionCol.state, depth: this.groupingDepth, onResize: (changedX, startIndex, endIndex) => this.onResizeGroup(changedX, startIndex, endIndex), additionalData: this.additionalData })),
      h("div", { class: `${HEADER_ROW_CLASS} ${HEADER_ACTUAL_ROW_CLASS}` }, cells),
    ];
  }
  get providers() {
    return {
      type: this.type,
      data: this.colData,
      viewport: this.viewportCol,
      dimension: this.dimensionCol,
      selection: this.selectionStore,
    };
  }
  get element() { return getElement(this); }
};
RevogrHeaderComponent.style = revogrHeaderStyleCss;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject_1(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce_1(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

var throttle_1 = throttle;

async function resizeObserver() {
  if (!('ResizeObserver' in window)) {
    const module = await import('./resize-observer-87bd1e3c.js');
    window.ResizeObserver = module.ResizeObserver;
  }
}

class GridResizeService {
  constructor(el, events) {
    this.events = events;
    this.resizeObserver = null;
    this.resize = throttle_1((e, o) => { var _a; return (_a = this.events) === null || _a === void 0 ? void 0 : _a.resize(e, o); }, 10);
    this.init(el);
  }
  async init(el) {
    var _a;
    await resizeObserver();
    this.resizeObserver = new ResizeObserver(this.resize);
    (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.observe(el);
  }
  destroy() {
    var _a;
    (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    this.resizeObserver = null;
  }
}

const revogrViewportScrollStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}.rowHeaders{z-index:2;font-size:10px;display:flex;height:100%}.rowHeaders revogr-data .rgCell{text-align:center}.rowHeaders .rgCell{padding:0 1em !important;min-width:100%}revogr-viewport-scroll{-ms-overflow-style:none;scrollbar-width:none;overflow-x:auto;overflow-y:hidden;position:relative;z-index:1;height:100%}revogr-viewport-scroll::-webkit-scrollbar{display:none;-webkit-appearance:none}revogr-viewport-scroll.colPinStart,revogr-viewport-scroll.colPinEnd{z-index:2}revogr-viewport-scroll.colPinEnd:has(.active){overflow:visible}revogr-viewport-scroll.rgCol{flex-grow:1}revogr-viewport-scroll .content-wrapper{overflow:hidden}revogr-viewport-scroll .inner-content-table{display:flex;flex-direction:column;max-height:100%;width:100%;min-width:100%;position:relative;z-index:0}revogr-viewport-scroll .vertical-inner{overflow-y:auto;position:relative;width:100%;flex-grow:1;-ms-overflow-style:none;scrollbar-width:none;}revogr-viewport-scroll .vertical-inner::-webkit-scrollbar{display:none;-webkit-appearance:none}revogr-viewport-scroll .vertical-inner revogr-data,revogr-viewport-scroll .vertical-inner revogr-overlay-selection{height:100%}";

const RevogrViewportScroll = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.scrollViewport = createEvent(this, "scrollViewport", 7);
    this.resizeViewport = createEvent(this, "resizeViewport", 7);
    this.scrollchange = createEvent(this, "scrollchange", 7);
    this.silentScroll = createEvent(this, "silentScroll", 7);
    this.scrollThrottling = 10;
    this.oldValY = this.contentHeight;
    this.oldValX = this.contentWidth;
    /**
     * Last mw event time for trigger scroll function below
     * If mousewheel function was ignored we still need to trigger render
     */
    this.mouseWheelScrollTimestamp = {
      rgCol: 0,
      rgRow: 0,
    };
    this.lastKnownScrollCoordinate = {
      rgCol: 0,
      rgRow: 0,
    };
    this.rowHeader = undefined;
    this.contentWidth = 0;
    this.contentHeight = 0;
  }
  async setScroll(e) {
    var _a;
    this.latestScrollUpdate(e.dimension);
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.setScroll(e);
  }
  /**
   * update on delta in case we don't know existing position or external change
   * @param e
   */
  async changeScroll(e, silent = false) {
    if (silent) {
      if (e.coordinate) {
        switch (e.dimension) {
          // for mobile devices to skip negative scroll loop. only on vertical scroll
          case 'rgRow':
            this.verticalScroll.style.transform = `translateY(${-1 * e.coordinate}px)`;
            break;
        }
      }
      return null;
    }
    if (e.delta) {
      switch (e.dimension) {
        case 'rgCol':
          e.coordinate = this.horizontalScroll.scrollLeft + e.delta;
          break;
        case 'rgRow':
          e.coordinate = this.verticalScroll.scrollTop + e.delta;
          break;
      }
      this.setScroll(e);
    }
    return e;
  }
  /**
   * Dispatch this event to trigger vertical mouse wheel from plugins
   */
  mousewheelVertical({ detail: e, }) {
    this.verticalMouseWheel(e);
  }
  /**
   * Dispatch this event to trigger horizontal mouse wheel from plugins
   */
  mousewheelHorizontal({ detail: e, }) {
    this.horizontalMouseWheel(e);
  }
  /**
   * Allows to use outside listener
   */
  scrollApply({ detail: { type, coordinate }, }) {
    this.applyOnScroll(type, coordinate, true);
  }
  connectedCallback() {
    /**
     * Bind scroll functions for farther usage
     */
    if ('ontouchstart' in document.documentElement) {
      this.scrollThrottling = 0;
    }
    // allow mousewheel for all devices including mobile
    this.verticalMouseWheel = this.onVerticalMouseWheel.bind(this, 'rgRow', 'deltaY');
    this.horizontalMouseWheel = this.onHorizontalMouseWheel.bind(this, 'rgCol', 'deltaX');
    /**
     * Create local scroll service
     */
    this.scrollService = new LocalScrollService({
      // to improve safari smoothnes on scroll
      // skipAnimationFrame: isSafariDesktop(),
      beforeScroll: e => this.scrollViewport.emit(e),
      afterScroll: e => {
        this.lastKnownScrollCoordinate[e.dimension] = e.coordinate;
        switch (e.dimension) {
          case 'rgCol':
            this.horizontalScroll.scrollLeft = e.coordinate;
            break;
          case 'rgRow':
            // this will trigger on scroll event
            this.verticalScroll.scrollTop = e.coordinate;
            // for mobile devices to skip negative scroll loop. only on vertical scroll
            if (this.verticalScroll.style.transform) {
              this.verticalScroll.style.transform = '';
            }
            break;
        }
      },
    });
  }
  componentDidLoad() {
    // track horizontal viewport resize
    this.resizeService = new GridResizeService(this.horizontalScroll, {
      resize: entries => {
        var _a, _b;
        let height = ((_a = entries[0]) === null || _a === void 0 ? void 0 : _a.contentRect.height) || 0;
        if (height) {
          height -= this.header.clientHeight + this.footer.clientHeight;
        }
        const els = {
          rgRow: {
            size: height,
            contentSize: this.contentHeight,
            scroll: this.verticalScroll.scrollTop,
          },
          rgCol: {
            size: ((_b = entries[0]) === null || _b === void 0 ? void 0 : _b.contentRect.width) || 0,
            contentSize: this.contentWidth,
            scroll: this.horizontalScroll.scrollLeft,
          },
        };
        each(els, (item, dimension) => {
          var _a;
          this.resizeViewport.emit({ dimension, size: item.size, rowHeader: this.rowHeader });
          (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(item.scroll, dimension, true);
          // track scroll visibility on outer element change
          this.setScrollVisibility(dimension, item.size, item.contentSize);
        });
      },
    });
  }
  /**
   * Check if scroll present or not per type
   * Trigger this method on inner content size change or on outer element size change
   * If inner content bigger then outer size then scroll is present and mousewheel binding required
   * @param type - dimension type 'rgRow/y' or 'rgCol/x'
   * @param size - outer content size
   * @param innerContentSize - inner content size
   */
  setScrollVisibility(type, size, innerContentSize) {
    // test if scroll present
    const hasScroll = size < innerContentSize;
    let el;
    // event reference for binding
    switch (type) {
      case 'rgCol':
        el = this.horizontalScroll;
        break;
      case 'rgRow':
        el = this.verticalScroll;
        break;
    }
    // based on scroll visibility assign or remove class and event
    if (hasScroll) {
      el.classList.add(`scroll-${type}`);
    }
    else {
      el.classList.remove(`scroll-${type}`);
    }
    this.scrollchange.emit({ type, hasScroll });
  }
  disconnectedCallback() {
    this.resizeService.destroy();
  }
  async componentDidRender() {
    // scroll update if number of rows changed
    if (this.contentHeight < this.oldValY && this.verticalScroll) {
      this.verticalScroll.scrollTop += this.contentHeight - this.oldValY;
    }
    this.oldValY = this.contentHeight;
    // scroll update if number of cols changed
    if (this.contentWidth < this.oldValX) {
      this.horizontalScroll.scrollLeft += this.contentWidth - this.oldValX;
    }
    this.oldValX = this.contentWidth;
    this.scrollService.setParams({
      contentSize: this.contentHeight,
      clientSize: this.verticalScroll.clientHeight,
      virtualSize: 0,
    }, 'rgRow');
    this.scrollService.setParams({
      contentSize: this.contentWidth,
      clientSize: this.horizontalScroll.clientWidth,
      virtualSize: 0,
    }, 'rgCol');
    this.setScrollVisibility('rgRow', this.verticalScroll.clientHeight, this.contentHeight);
    this.setScrollVisibility('rgCol', this.horizontalScroll.clientWidth, this.contentWidth);
  }
  render() {
    return (h(Host, { onWheel: this.horizontalMouseWheel, onScroll: (e) => this.onScroll('rgCol', e) }, h("div", { class: "inner-content-table", style: { width: `${this.contentWidth}px` } }, h("div", { class: "header-wrapper", ref: e => (this.header = e) }, h("slot", { name: HEADER_SLOT })), h("div", { class: "vertical-inner", ref: el => (this.verticalScroll = el), onWheel: this.verticalMouseWheel, onScroll: (e) => this.onScroll('rgRow', e) }, h("div", { class: "content-wrapper", style: { height: `${this.contentHeight}px` } }, h("slot", { name: CONTENT_SLOT }))), h("div", { class: "footer-wrapper", ref: e => (this.footer = e) }, h("slot", { name: FOOTER_SLOT })))));
  }
  /**
   * Extra layer for scroll event monitoring, where MouseWheel event is not passing
   * We need to trigger scroll event in case there is no mousewheel event
   */
  onScroll(type, e) {
    if (!(e.target instanceof HTMLElement)) {
      return;
    }
    const target = e.target;
    let scroll = 0;
    switch (type) {
      case 'rgCol':
        scroll = target === null || target === void 0 ? void 0 : target.scrollLeft;
        break;
      case 'rgRow':
        scroll = target === null || target === void 0 ? void 0 : target.scrollTop;
        break;
    }
    // for mobile devices to skip negative scroll loop
    if (scroll < 0) {
      this.silentScroll.emit({ dimension: type, coordinate: scroll });
      return;
    }
    this.applyOnScroll(type, scroll);
  }
  /**
   * Applies scroll on scroll event only if mousewheel event was some time ago
   */
  applyOnScroll(type, coordinate, outside = false) {
    var _a;
    const change = new Date().getTime() - this.mouseWheelScrollTimestamp[type];
    // apply after throttling
    if (change > this.scrollThrottling && coordinate !== this.lastKnownScrollCoordinate[type]) {
      (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(coordinate, type, undefined, undefined, outside);
    }
  }
  /** remember last mw event time */
  latestScrollUpdate(dimension) {
    this.mouseWheelScrollTimestamp[dimension] = new Date().getTime();
  }
  /**
   * On vertical mousewheel event
   * @param type
   * @param delta
   * @param e
   */
  onVerticalMouseWheel(type, delta, e) {
    var _a;
    e.preventDefault && e.preventDefault();
    const pos = this.verticalScroll.scrollTop + e[delta];
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(pos, type, undefined, e[delta]);
    this.latestScrollUpdate(type);
  }
  /**
   * On horizontal mousewheel event
   * @param type
   * @param delta
   * @param e
   */
  onHorizontalMouseWheel(type, delta, e) {
    var _a;
    e.preventDefault && e.preventDefault();
    const pos = this.horizontalScroll.scrollLeft + e[delta];
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(pos, type, undefined, e[delta]);
    this.latestScrollUpdate(type);
  }
  get horizontalScroll() { return getElement(this); }
};
RevogrViewportScroll.style = revogrViewportScrollStyleCss;

export { RevogridCellRenderer as revogr_cell, RevogrData as revogr_data, RevogrHeaderComponent as revogr_header, RevogrViewportScroll as revogr_viewport_scroll };

//# sourceMappingURL=revogr-cell_4.entry.js.map