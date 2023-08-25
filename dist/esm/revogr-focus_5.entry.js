/*!
 * Built by Revolist
 */
import { r as registerInstance, c as createEvent, h, H as Host, g as getElement } from './index-7fd83173.js';
import { A as getItemByPosition, n as getItemByIndex, g as getSourceItem, F as FOCUS_CLASS, E as EDIT_INPUT_WR, w as timeout, R as RESIZE_INTERVAL, C as CELL_HANDLER_CLASS, M as MOBILE_CLASS, S as SELECTION_BORDER_CLASS, D as DataStore, B as ROW_HEADER_TYPE, U as UUID, z as getScrollbarWidth, T as TMP_SELECTION_BG_CLASS } from './index-a937c03b.js';
import { C as ColumnService, L as LocalScrollService } from './localScrollService-9c3949fd.js';
import { n as getRange, o as isRangeSingleCell, H as HEADER_SLOT, l as lodash } from './viewport.helpers-b34b34b0.js';
import { c as codesLetter, i as isClear, a as isEnterKey, b as isCopy, d as isCut, e as isPaste, f as isAll, g as isLetterKey } from './keyCodes.utils-152ac850.js';
import { d as debounce_1 } from './debounce-48584128.js';
import { g as getFromEvent, v as verifyTouchTarget, V as ViewportStore, c as calculateRowHeaderSize } from './events-a9d2c5b9.js';

/** Calculate cell based on x, y position */
function getCurrentCell({ x, y }, { el, rows, cols }) {
  const { top, left, height, width } = el.getBoundingClientRect();
  let cellY = y - top;
  // limit to element height
  if (cellY >= height) {
    cellY = height - 1;
  }
  let cellX = x - left;
  // limit to element width
  if (cellX >= width) {
    cellX = width - 1;
  }
  const rgRow = getItemByPosition(rows, cellY);
  const rgCol = getItemByPosition(cols, cellX);
  // before first
  if (rgCol.itemIndex < 0) {
    rgCol.itemIndex = 0;
  }
  // before first
  if (rgRow.itemIndex < 0) {
    rgRow.itemIndex = 0;
  }
  return { x: rgCol.itemIndex, y: rgRow.itemIndex };
}
function getCoordinate(range, focus, changes, isMulti = false) {
  const updateCoordinate = (c) => {
    const start = { x: range.x, y: range.y };
    const end = isMulti ? { x: range.x1, y: range.y1 } : start;
    const point = end[c] > focus[c] ? end : start;
    point[c] += changes[c];
    return { start, end };
  };
  if (changes.x) {
    return updateCoordinate('x');
  }
  if (changes.y) {
    return updateCoordinate('y');
  }
  return null;
}
/** check if out of range */
function isAfterLast({ x, y }, { lastCell }) {
  return x >= lastCell.x || y >= lastCell.y;
}
/** check if out of range */
function isBeforeFirst({ x, y }) {
  return x < 0 || y < 0;
}
/** Compare cells, only 1 coordinate difference is possible */
// export function getDirectionCoordinate(initial: Cell, last: Cell): Partial<Cell> | null {
//   const c: (keyof Cell)[] = ['x', 'y'];
//   for (let k of c) {
//     if (initial[k] !== last[k]) {
//       return { [k]: 1 };
//     }
//   }
//   return null;
// }
// export function getLargestAxis(initial: Cell, last: Cell): Partial<Cell> | null {
//   const cell: Partial<Cell> = {};
//   const c: (keyof Cell)[] = ['x', 'y'];
//   for (let k of c) {
//     cell[k] = Math.abs(initial[k] - last[k]);
//   }
//   if (cell.x > cell.y) {
//     return { x: 1 };
//   }
//   if (cell.y > cell.x) {
//     return { y: 1 };
//   }
//   return null;
// }
function styleByCellProps(styles) {
  return {
    left: `${styles.left}px`,
    top: `${styles.top}px`,
    width: `${styles.width}px`,
    height: `${styles.height}px`,
  };
}
function getCell({ x, y, x1, y1 }, dimensionRow, dimensionCol) {
  const top = getItemByIndex(dimensionRow, y).start;
  const left = getItemByIndex(dimensionCol, x).start;
  const bottom = getItemByIndex(dimensionRow, y1).end;
  const right = getItemByIndex(dimensionCol, x1).end;
  return {
    left,
    right,
    top,
    bottom,
    width: right - left,
    height: bottom - top,
  };
}
function getElStyle(range, dimensionRow, dimensionCol) {
  const styles = getCell(range, dimensionRow, dimensionCol);
  return styleByCellProps(styles);
}

const revogrFocusStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}revogr-focus.focused-cell{box-shadow:-1px 0 0 #0d63e8 inset, 1px 0 0 #0d63e8 inset, 0 -1px 0 #0d63e8 inset, 0 1px 0 #0d63e8 inset;position:absolute;pointer-events:none;z-index:9;display:block !important}";

const RevogrFocus$1 = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.beforeFocusRender = createEvent(this, "before-focus-render", 7);
    this.beforeScrollIntoView = createEvent(this, "beforescrollintoview", 7);
    this.afterFocus = createEvent(this, "afterfocus", 7);
    this.activeFocus = null;
    this.selectionStore = undefined;
    this.dimensionRow = undefined;
    this.dimensionCol = undefined;
    this.dataStore = undefined;
    this.colData = undefined;
    this.colType = undefined;
    this.rowType = undefined;
    this.focusTemplate = null;
  }
  changed(e, focus) {
    const beforeScrollIn = this.beforeScrollIntoView.emit({ el: e });
    if (!beforeScrollIn.defaultPrevented) {
      e.scrollIntoView({
        block: 'nearest',
        inline: 'nearest',
      });
    }
    const model = getSourceItem(this.dataStore, focus.y);
    const column = getSourceItem(this.colData, focus.x);
    this.afterFocus.emit({
      model,
      column
    });
  }
  componentDidRender() {
    var _a, _b;
    const currentFocus = this.selectionStore.get('focus');
    if (((_a = this.activeFocus) === null || _a === void 0 ? void 0 : _a.x) === (currentFocus === null || currentFocus === void 0 ? void 0 : currentFocus.x) && ((_b = this.activeFocus) === null || _b === void 0 ? void 0 : _b.y) === (currentFocus === null || currentFocus === void 0 ? void 0 : currentFocus.y)) {
      return;
    }
    this.activeFocus = currentFocus;
    currentFocus && this.el && this.changed(this.el, currentFocus);
  }
  render() {
    const editCell = this.selectionStore.get('edit');
    if (editCell) {
      return;
    }
    const data = this.selectionStore.get('focus');
    if (data) {
      const event = this.beforeFocusRender.emit({
        range: Object.assign(Object.assign({}, data), { x1: data.x, y1: data.y }),
        rowType: this.rowType,
        colType: this.colType,
      });
      if (event.defaultPrevented) {
        return h("slot", null);
      }
      const { detail } = event;
      const style = getElStyle(detail.range, this.dimensionRow.state, this.dimensionCol.state);
      const extra = this.focusTemplate && this.focusTemplate(h, detail);
      return h(Host, { class: FOCUS_CLASS, style: style }, h("slot", null), extra);
    }
  }
  get el() { return getElement(this); }
};
RevogrFocus$1.style = revogrFocusStyleCss;

class SelectionStoreService {
  constructor(store, config) {
    this.store = store;
    this.config = config;
    this.store = store;
  }
  get edited() {
    return this.store.get('edit');
  }
  get focused() {
    return this.store.get('focus');
  }
  get ranged() {
    return this.store.get('range');
  }
  changeRange(range) {
    return this.config.changeRange(range);
  }
  focus(cell, isMulti = false) {
    if (!cell) {
      return false;
    }
    let end = cell;
    // range edit
    if (isMulti) {
      let start = this.store.get('focus');
      if (start) {
        return this.config.changeRange(getRange(start, end));
      }
    }
    // single focus
    return this.config.focus(cell, end);
  }
}

// is edit input
function isEditInput(el) {
  return !!(el === null || el === void 0 ? void 0 : el.closest(`.${EDIT_INPUT_WR}`));
}

const DIRECTION_CODES = [
  codesLetter.TAB,
  codesLetter.ARROW_UP,
  codesLetter.ARROW_DOWN,
  codesLetter.ARROW_LEFT,
  codesLetter.ARROW_RIGHT,
];
class KeyboardService {
  constructor(sv) {
    this.sv = sv;
  }
  async keyDown(e, canRange) {
    // IF EDIT MODE
    if (this.sv.selectionStoreService.edited) {
      switch (e.code) {
        case codesLetter.ESCAPE:
          this.sv.cancelEdit();
          break;
      }
      return;
    }
    // IF NOT EDIT MODE
    // pressed clear key
    if (this.sv.selectionStoreService.ranged && isClear(e.code)) {
      this.sv.clearCell();
      return;
    }
    // below works with focus only
    if (!this.sv.selectionStoreService.focused) {
      return;
    }
    // tab key means same as arrow right
    if (codesLetter.TAB === e.code) {
      this.keyChangeSelection(e, canRange);
      return;
    }
    // pressed enter
    if (isEnterKey(e.code)) {
      this.sv.applyEdit();
      return;
    }
    // copy operation
    if (isCopy(e)) {
      return;
    }
    // cut operation
    if (isCut(e)) {
      return;
    }
    // paste operation
    if (isPaste(e)) {
      this.sv.internalPaste();
      return;
    }
    // select all
    if (isAll(e)) {
      if (canRange) {
        this.selectAll(e);
      }
      return;
    }
    // pressed letter key
    if (isLetterKey(e.keyCode)) {
      this.sv.applyEdit(e.key);
      return;
    }
    // pressed arrow, change selection position
    if (await this.keyChangeSelection(e, canRange)) {
      return;
    }
  }
  selectAll(e) {
    const range = this.sv.selectionStore.get('range');
    const focus = this.sv.selectionStore.get('focus');
    // if no range or focus - do nothing
    if (!range || !focus) {
      return;
    }
    e.preventDefault();
    this.sv.selectAll();
  }
  async keyChangeSelection(e, canRange) {
    const data = this.changeDirectionKey(e, canRange);
    if (!data) {
      return false;
    }
    // this interval needed for several cases
    // grid could be resized before next click
    // at this case to avoid screen jump we use this interval
    await timeout(RESIZE_INTERVAL + 30);
    const range = this.sv.selectionStore.get('range');
    const focus = this.sv.selectionStore.get('focus');
    return this.keyPositionChange(data.changes, range, focus, data.isMulti);
  }
  keyPositionChange(changes, range, focus, isMulti = false) {
    if (!range || !focus) {
      return false;
    }
    const data = getCoordinate(range, focus, changes, isMulti);
    if (!data) {
      return false;
    }
    if (isMulti) {
      const eData = this.sv.getData();
      if (isAfterLast(data.end, eData) || isBeforeFirst(data.start)) {
        return false;
      }
      const range = getRange(data.start, data.end);
      return this.sv.range(range);
    }
    return this.sv.focusNext(data.start, changes);
  }
  /** Monitor key direction changes */
  changeDirectionKey(e, canRange) {
    const isMulti = canRange && e.shiftKey;
    if (DIRECTION_CODES.includes(e.code)) {
      e.preventDefault();
    }
    switch (e.code) {
      case codesLetter.ARROW_UP:
        return { changes: { y: -1 }, isMulti };
      case codesLetter.ARROW_DOWN:
        return { changes: { y: 1 }, isMulti };
      case codesLetter.ARROW_LEFT:
        return { changes: { x: -1 }, isMulti };
      case codesLetter.TAB:
      case codesLetter.ARROW_RIGHT:
        return { changes: { x: 1 }, isMulti };
    }
  }
}

var AutoFillType;
(function (AutoFillType) {
  AutoFillType["selection"] = "Selection";
  AutoFillType["autoFill"] = "AutoFill";
})(AutoFillType || (AutoFillType = {}));
class AutoFillService {
  constructor(sv) {
    this.sv = sv;
    this.autoFillType = null;
    this.autoFillInitial = null;
    this.autoFillStart = null;
    this.autoFillLast = null;
  }
  /**
   * Render autofill box
   * @param range
   * @param selectionFocus
   */
  renderAutofill(range, selectionFocus) {
    let handlerStyle;
    if (range) {
      handlerStyle = getCell(range, this.sv.dimensionRow.state, this.sv.dimensionCol.state);
    }
    else {
      handlerStyle = getCell(Object.assign(Object.assign({}, selectionFocus), { x1: selectionFocus.x, y1: selectionFocus.y }), this.sv.dimensionRow.state, this.sv.dimensionCol.state);
    }
    return (h("div", { class: {
        [CELL_HANDLER_CLASS]: true,
        [MOBILE_CLASS]: true,
      }, style: { left: `${handlerStyle.right}px`, top: `${handlerStyle.bottom}px` }, onMouseDown: (e) => this.autoFillHandler(e), onTouchStart: (e) => this.autoFillHandler(e) }));
  }
  autoFillHandler(e, type = AutoFillType.autoFill) {
    let target = null;
    if (e.target instanceof Element) {
      target = e.target;
    }
    if (!target) {
      return;
    }
    this.selectionStart(target, this.sv.getData(), type);
    e.preventDefault();
  }
  get isAutoFill() {
    return !!this.autoFillType;
  }
  /** Process mouse move events */
  selectionMouseMove(e) {
    // initiate mouse move debounce if not present
    if (!this.onMouseMoveAutofill) {
      this.onMouseMoveAutofill = debounce_1((e, data) => this.doAutofillMouseMove(e, data), 5);
    }
    if (this.isAutoFill) {
      this.onMouseMoveAutofill(e, this.sv.getData());
    }
  }
  getFocus() {
    let focus = this.sv.selectionStoreService.focused;
    const range = this.sv.selectionStoreService.ranged;
    // there was an issue that it was taking last cell from range but focus was out
    if (!focus && range) {
      focus = { x: range.x, y: range.y };
    }
    return focus || null;
  }
  /**
   * Autofill logic:
   * on mouse move apply based on previous direction (if present)
   */
  doAutofillMouseMove(event, data) {
    // if no initial - not started
    if (!this.autoFillInitial) {
      return;
    }
    const x = getFromEvent(event, 'clientX', MOBILE_CLASS);
    const y = getFromEvent(event, 'clientY', MOBILE_CLASS);
    // skip touch
    if (x === null || y === null) {
      return;
    }
    const current = getCurrentCell({ x, y }, data);
    // first time or direction equal to start(same as first time)
    if (!this.autoFillLast) {
      if (!this.autoFillLast) {
        this.autoFillLast = this.autoFillStart;
      }
    }
    // check if not the latest, if latest - do nothing
    if (isAfterLast(current, data)) {
      return;
    }
    this.autoFillLast = current;
    const isSame = current.x === this.autoFillInitial.x && current.y === this.autoFillInitial.y;
    // if same as initial - clear
    if (isSame) {
      this.sv.setTempRange(null);
    }
    else {
      this.sv.setTempRange({
        area: getRange(this.autoFillInitial, this.autoFillLast),
        type: this.autoFillType,
      });
    }
  }
  /**
   * Range selection started
   * Mode @param type:
   * Can be triggered from MouseDown selection on element
   * Or can be triggered on corner square drag
   */
  selectionStart(target, data, type = AutoFillType.selection) {
    /** Get cell by autofill element */
    const { top, left } = target.getBoundingClientRect();
    this.autoFillInitial = this.getFocus();
    this.autoFillType = type;
    this.autoFillStart = getCurrentCell({ x: left, y: top }, data);
  }
  /**
   * Clear current range selection
   * on mouse up and mouse leave events
   */
  clearAutoFillSelection() {
    // Apply autofill values on mouse up if present
    if (this.autoFillInitial) {
      // Get latest
      this.autoFillInitial = this.getFocus();
      // Apply range data if present
      if (this.autoFillType === AutoFillType.autoFill) {
        const range = getRange(this.autoFillInitial, this.autoFillLast);
        if (range) {
          const { defaultPrevented: stopApply, detail: { range: newRange } } = this.sv.clearRangeDataApply({
            range,
          });
          if (!stopApply) {
            this.applyRangeWithData(newRange);
          }
          else {
            // if prevented - clear temp range
            this.sv.setTempRange(null);
          }
        }
      }
      else {
        this.applyRangeOnly(this.autoFillInitial, this.autoFillLast);
      }
    }
    this.autoFillType = null;
    this.autoFillInitial = null;
    this.autoFillLast = null;
    this.autoFillStart = null;
  }
  /** Trigger range apply events and handle responses */
  onRangeApply(data, range) {
    const models = {};
    for (let rowIndex in data) {
      models[rowIndex] = getSourceItem(this.sv.dataStore, parseInt(rowIndex, 10));
    }
    const { defaultPrevented: stopRange, detail, } = this.sv.rangeDataApply({
      data,
      models,
      type: this.sv.dataStore.get('type'),
    });
    if (!stopRange) {
      this.sv.columnService.applyRangeData(detail.data);
    }
    this.sv.setRange(range);
  }
  /** Apply range and copy data during range application */
  applyRangeWithData(newRange) {
    const oldRange = this.sv.selectionStoreService.ranged;
    const rangeData = {
      type: this.sv.dataStore.get('type'),
      colType: this.sv.columnService.type,
      newData: {},
      mapping: {},
      newRange,
      oldRange,
    };
    const { mapping, changed } = this.sv.columnService.getRangeData(rangeData, this.sv.columnService.columns);
    rangeData.newData = changed;
    rangeData.mapping = mapping;
    let e = this.sv.selectionChanged(rangeData);
    // if default prevented - clear range
    if (e.defaultPrevented) {
      this.sv.setTempRange(null);
      return;
    }
    e = this.sv.rangeCopy(rangeData);
    if (e.defaultPrevented) {
      this.sv.setRange(newRange);
      return;
    }
    this.onRangeApply(rangeData.newData, newRange);
  }
  /**
   * Update range selection only,
   * no data change (mouse selection)
   */
  applyRangeOnly(start, end) {
    // no changes to apply
    if (!start || !end) {
      return;
    }
    const newRange = getRange(start, end);
    this.sv.setRange(newRange);
  }
}

class ClipboardService {
  constructor(sv) {
    this.sv = sv;
  }
  renderClipboard(readonly = false) {
    return h("revogr-clipboard", { readonly: readonly, onCopyRegion: e => this.onCopy(e.detail), onClearRegion: () => this.sv.rangeClear(), ref: e => (this.clipboard = e), onPasteRegion: e => this.onPaste(e.detail) });
  }
  getRegion() {
    const focus = this.sv.selectionStoreService.focused;
    let range = this.sv.selectionStoreService.ranged;
    if (!range) {
      range = getRange(focus, focus);
    }
    return range;
  }
  onCopy(e) {
    const range = this.getRegion();
    const canCopyEvent = this.sv.beforeCopy(range);
    if (canCopyEvent.defaultPrevented) {
      return false;
    }
    const data = this.sv.rangeCopy(range);
    this.clipboard.doCopy(e, data);
    return true;
  }
  onPaste(data) {
    const focus = this.sv.selectionStoreService.focused;
    const isEditing = this.sv.selectionStoreService.edited !== null;
    if (!focus || isEditing) {
      return;
    }
    let { changed, range } = this.sv.columnService.getTransformedDataToApply(focus, data);
    const { defaultPrevented: canPaste } = this.sv.beforePaste(changed, range);
    if (canPaste) {
      return;
    }
    this.sv.rangeApply(changed, range);
  }
}

const revogrOverlayStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}revogr-overlay-selection{display:block;position:relative;width:100%}revogr-overlay-selection .autofill-handle{position:absolute;width:14px;height:14px;margin-left:-13px;margin-top:-13px;z-index:10;cursor:crosshair}revogr-overlay-selection .autofill-handle::before{content:\"\";position:absolute;right:0;bottom:0;width:10px;height:10px;background:#0d63e8;border:1px solid white;box-sizing:border-box}revogr-overlay-selection.mobile .autofill-handle{position:absolute;width:30px;height:30px;margin-left:-29px;margin-top:-29px;z-index:10;cursor:crosshair}revogr-overlay-selection.mobile .autofill-handle::before{content:\"\";position:absolute;right:0;bottom:0;width:12px;height:12px;background:#0d63e8;border:1px solid white;box-sizing:border-box}revogr-overlay-selection .selection-border-range{position:absolute;pointer-events:none;z-index:9;box-shadow:-1px 0 0 #0d63e8 inset, 1px 0 0 #0d63e8 inset, 0 -1px 0 #0d63e8 inset, 0 1px 0 #0d63e8 inset}revogr-overlay-selection .selection-border-range .range-handlers{height:100%;background-color:transparent;width:75%;max-width:50px;min-width:20px;left:50%;transform:translateX(-50%);position:absolute}revogr-overlay-selection .selection-border-range .range-handlers>span{pointer-events:auto;height:20px;width:20px;position:absolute;left:50%;transform:translateX(-50%)}revogr-overlay-selection .selection-border-range .range-handlers>span:before,revogr-overlay-selection .selection-border-range .range-handlers>span:after{position:absolute;border-radius:5px;width:15px;height:5px;left:50%;transform:translateX(-50%);background-color:rgba(0, 0, 0, 0.2)}revogr-overlay-selection .selection-border-range .range-handlers>span:first-child{top:-7px}revogr-overlay-selection .selection-border-range .range-handlers>span:first-child:before{content:\"\";top:0}revogr-overlay-selection .selection-border-range .range-handlers>span:last-child{bottom:-7px}revogr-overlay-selection .selection-border-range .range-handlers>span:last-child:after{content:\"\";bottom:0}revogr-overlay-selection revogr-edit{z-index:10}";

const OverlaySelection = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.internalCopy = createEvent(this, "internalCopy", 7);
    this.internalPaste = createEvent(this, "internalPaste", 7);
    this.internalCellEdit = createEvent(this, "internalCellEdit", 7);
    this.beforeFocusCell = createEvent(this, "beforeFocusCell", 7);
    this.setEdit = createEvent(this, "setEdit", 7);
    this.beforeApplyRange = createEvent(this, "before-apply-range", 7);
    this.beforeSetRange = createEvent(this, "before-set-range", 7);
    this.beforeEditRender = createEvent(this, "before-edit-render", 7);
    this.setRange = createEvent(this, "setRange", 7);
    this.selectAll = createEvent(this, "selectall", 7);
    this.cancelEdit = createEvent(this, "cancelEdit", 7);
    this.setTempRange = createEvent(this, "setTempRange", 7);
    this.applyFocus = createEvent(this, "applyFocus", 7);
    this.focusCell = createEvent(this, "focusCell", 7);
    this.beforeRangeDataApply = createEvent(this, "beforeRangeDataApply", 7);
    this.internalSelectionChanged = createEvent(this, "internalSelectionChanged", 7);
    this.beforeRangeCopyApply = createEvent(this, "beforeRangeCopyApply", 7);
    this.internalRangeDataApply = createEvent(this, "internalRangeDataApply", 7);
    this.rangeClipboardCopy = createEvent(this, "rangeClipboardCopy", 7);
    this.rangeClipboardPaste = createEvent(this, "rangeClipboardPaste", 7);
    this.beforeKeyDown = createEvent(this, "beforekeydown", 7);
    this.beforeKeyUp = createEvent(this, "beforekeyup", 7);
    this.beforeCellSave = createEvent(this, "before-cell-save", 7);
    this.keyboardService = null;
    this.autoFillService = null;
    this.clipboardService = null;
    this.revogrEdit = null;
    this.readonly = undefined;
    this.range = undefined;
    this.canDrag = undefined;
    this.useClipboard = undefined;
    this.selectionStore = undefined;
    this.dimensionRow = undefined;
    this.dimensionCol = undefined;
    this.dataStore = undefined;
    this.colData = undefined;
    this.lastCell = undefined;
    this.editors = undefined;
    this.applyChangesOnClose = false;
    this.additionalData = undefined;
    this.isMobileDevice = undefined;
  }
  // --------------------------------------------------------------------------
  //
  //  Listeners
  //
  // --------------------------------------------------------------------------
  onMouseMove(e) {
    if (this.selectionStoreService.focused) {
      this.autoFillService.selectionMouseMove(e);
    }
  }
  /** Action finished inside of the document */
  /** Pointer left document, clear any active operation */
  onMouseUp() {
    this.autoFillService.clearAutoFillSelection();
  }
  /** Row drag started */
  onCellDrag(e) {
    var _a;
    (_a = this.orderEditor) === null || _a === void 0 ? void 0 : _a.dragStart(e.detail);
  }
  /** Get keyboard down from element */
  onKeyUp(e) {
    this.beforeKeyUp.emit(e);
  }
  /** Get keyboard down from element */
  onKeyDown(e) {
    var _a;
    const proxy = this.beforeKeyDown.emit(e);
    if (e.defaultPrevented || proxy.defaultPrevented) {
      return;
    }
    (_a = this.keyboardService) === null || _a === void 0 ? void 0 : _a.keyDown(e, this.range);
  }
  // selection & keyboard
  selectionServiceSet(s) {
    this.selectionStoreService = new SelectionStoreService(s, {
      changeRange: range => this.triggerRangeEvent(range),
      focus: (focus, end) => this.doFocus(focus, end),
    });
    this.keyboardService = new KeyboardService({
      selectionStoreService: this.selectionStoreService,
      selectionStore: s,
      range: r => this.selectionStoreService.changeRange(r),
      focusNext: (f, next) => this.doFocus(f, f, next),
      applyEdit: val => {
        if (this.readonly) {
          return;
        }
        this.doEdit(val);
      },
      cancelEdit: async () => {
        await this.revogrEdit.cancel();
        this.closeEdit();
      },
      clearCell: () => !this.readonly && this.clearCell(),
      internalPaste: () => !this.readonly && this.internalPaste.emit(),
      getData: () => this.getData(),
      selectAll: () => this.selectAll.emit(),
    });
    this.createAutoFillService();
    this.createClipboardService();
  }
  // autofill
  createAutoFillService() {
    this.autoFillService = new AutoFillService({
      selectionStoreService: this.selectionStoreService,
      dimensionRow: this.dimensionRow,
      dimensionCol: this.dimensionCol,
      columnService: this.columnService,
      dataStore: this.dataStore,
      clearRangeDataApply: e => this.beforeRangeDataApply.emit(Object.assign(Object.assign({}, e), this.types)),
      setTempRange: e => this.setTempRange.emit(e),
      selectionChanged: e => this.internalSelectionChanged.emit(e),
      rangeCopy: e => this.beforeRangeCopyApply.emit(e),
      rangeDataApply: e => this.internalRangeDataApply.emit(e),
      setRange: e => this.triggerRangeEvent(e),
      getData: () => this.getData(),
    });
  }
  // columns
  columnServiceSet() {
    var _a;
    (_a = this.columnService) === null || _a === void 0 ? void 0 : _a.destroy();
    this.columnService = new ColumnService(this.dataStore, this.colData);
    this.createAutoFillService();
    this.createClipboardService();
  }
  // clipboard
  createClipboardService() {
    this.clipboardService = new ClipboardService({
      selectionStoreService: this.selectionStoreService,
      columnService: this.columnService,
      dataStore: this.dataStore,
      rangeApply: (d, r) => this.autoFillService.onRangeApply(d, r),
      rangeCopy: range => {
        if (!range) {
          return undefined;
        }
        const { data, mapping } = this.columnService.copyRangeArray(range, this.dataStore);
        const event = this.rangeClipboardCopy.emit(Object.assign({ range,
          data,
          mapping }, this.types));
        if (event.defaultPrevented) {
          return undefined;
        }
        return event.detail.data;
      },
      rangeClear: () => !this.readonly && this.clearCell(),
      beforeCopy: range => this.internalCopy.emit(range),
      beforePaste: (data, range) => {
        return this.rangeClipboardPaste.emit(Object.assign({ data,
          range }, this.types));
      },
    });
  }
  connectedCallback() {
    this.columnServiceSet();
    this.selectionServiceSet(this.selectionStore);
  }
  disconnectedCallback() {
    var _a;
    (_a = this.columnService) === null || _a === void 0 ? void 0 : _a.destroy();
  }
  renderRange(range) {
    const style = getElStyle(range, this.dimensionRow.state, this.dimensionCol.state);
    return [
      h("div", { class: SELECTION_BORDER_CLASS, style: style }, this.isMobileDevice && h("div", { class: "range-handlers" }, h("span", { class: MOBILE_CLASS }), h("span", { class: MOBILE_CLASS })))
    ];
  }
  renderEditCell() {
    // if can edit
    const editCell = this.selectionStore.get('edit');
    if (this.readonly || !editCell) {
      return null;
    }
    const val = editCell.val || this.columnService.getCellData(editCell.y, editCell.x);
    const editable = Object.assign(Object.assign({}, editCell), this.columnService.getSaveData(editCell.y, editCell.x, val));
    const renderEvent = this.beforeEditRender.emit(Object.assign({ range: Object.assign(Object.assign({}, editCell), { x1: editCell.x, y1: editCell.y }) }, this.types));
    if (renderEvent.defaultPrevented) {
      return null;
    }
    const { detail: { range }, } = renderEvent;
    const style = getElStyle(range, this.dimensionRow.state, this.dimensionCol.state);
    return (h("revogr-edit", { ref: el => {
        this.revogrEdit = el;
      }, onCellEdit: e => {
        const saveEv = this.beforeCellSave.emit(e.detail);
        if (!saveEv.defaultPrevented) {
          this.cellEdit(saveEv.detail);
        }
        // if not clear navigate to next cell after edit
        if (!saveEv.detail.preventFocus) {
          this.focusNext();
        }
      }, onCloseEdit: e => this.closeEdit(e), editCell: editable, saveOnClose: this.applyChangesOnClose, column: this.columnService.columns[editCell.x], editor: this.columnService.getCellEditor(editCell.y, editCell.x, this.editors), additionalData: this.additionalData, style: style }));
  }
  render() {
    const els = [];
    const editCell = this.renderEditCell();
    if (editCell) {
      els.push(editCell);
    }
    else {
      const range = this.selectionStoreService.ranged;
      const selectionFocus = this.selectionStoreService.focused;
      if ((range || selectionFocus) && this.useClipboard) {
        els.push(this.clipboardService.renderClipboard(this.readonly));
      }
      if (range) {
        els.push(...this.renderRange(range));
      }
      if (selectionFocus && !this.readonly && this.range) {
        els.push(this.autoFillService.renderAutofill(range, selectionFocus));
      }
      if (this.canDrag) {
        els.push(h("revogr-order-editor", { ref: e => (this.orderEditor = e), dataStore: this.dataStore, dimensionRow: this.dimensionRow, dimensionCol: this.dimensionCol, parent: this.element, onInternalRowDragStart: e => this.onRowDragStart(e) }));
      }
    }
    return (h(Host, { class: { mobile: this.isMobileDevice },
      // run edit on dblclick
      onDblClick: (e) => {
        // if dblclick prevented outside edit will not start
        if (!e.defaultPrevented) {
          this.doEdit();
        }
      }, onMouseDown: (e) => this.onElementMouseDown(e), onTouchStart: (e) => this.onElementMouseDown(e, true) }, els, h("slot", { name: "data" })));
  }
  doFocus(focus, end, next) {
    const { defaultPrevented } = this.beforeFocusCell.emit(this.columnService.getSaveData(focus.y, focus.x));
    if (defaultPrevented) {
      return false;
    }
    const evData = Object.assign({ range: Object.assign(Object.assign({}, focus), { x1: end.x, y1: end.y }), next }, this.types);
    const applyEvent = this.applyFocus.emit(evData);
    if (applyEvent.defaultPrevented) {
      return false;
    }
    const { range } = applyEvent.detail;
    return !this.focusCell.emit(Object.assign({ focus: {
        x: range.x,
        y: range.y,
      }, end: {
        x: range.x1,
        y: range.y1,
      } }, applyEvent.detail)).defaultPrevented;
  }
  triggerRangeEvent(range) {
    const type = this.types.rowType;
    const applyEvent = this.beforeApplyRange.emit(Object.assign({ range: Object.assign({}, range) }, this.types));
    if (applyEvent.defaultPrevented) {
      return false;
    }
    const data = this.columnService.getRangeTransformedToProps(applyEvent.detail.range, this.dataStore);
    let e = this.beforeSetRange.emit(data);
    e = this.setRange.emit(Object.assign(Object.assign({}, applyEvent.detail.range), { type }));
    if (e.defaultPrevented) {
      return false;
    }
    return !e.defaultPrevented;
  }
  onElementMouseDown(e, touch = false) {
    // Ignore focus if clicked input
    if (isEditInput(e.target)) {
      return;
    }
    const data = this.getData();
    if (e.defaultPrevented) {
      return;
    }
    const x = getFromEvent(e, 'clientX');
    const y = getFromEvent(e, 'clientY');
    // skip touch
    if (x === null || y === null) {
      return;
    }
    // Regular cell click
    const focusCell = getCurrentCell({ x, y }, data);
    this.selectionStoreService.focus(focusCell, this.range && e.shiftKey);
    // Initiate autofill selection
    if (this.range) {
      this.autoFillService.selectionStart(e.target, data);
      if (!touch) {
        e.preventDefault();
      }
      else if (verifyTouchTarget(e.touches[0], MOBILE_CLASS)) {
        e.preventDefault();
      }
    }
  }
  /**
   * Start cell editing
   */
  doEdit(val = '') {
    var _a;
    if (this.canEdit()) {
      const editCell = this.selectionStore.get('focus');
      const data = this.columnService.getSaveData(editCell.y, editCell.x);
      (_a = this.setEdit) === null || _a === void 0 ? void 0 : _a.emit(Object.assign(Object.assign({}, data), { val }));
    }
  }
  /**
   * Close editor event triggered
   * @param details - if requires focus next
   */
  closeEdit(e) {
    this.cancelEdit.emit();
    if (e === null || e === void 0 ? void 0 : e.detail) {
      this.focusNext();
    }
  }
  /** Edit finished, close cell and save */
  cellEdit(e) {
    const dataToSave = this.columnService.getSaveData(e.rgRow, e.rgCol, e.val);
    this.internalCellEdit.emit(dataToSave);
  }
  async focusNext() {
    const canFocus = await this.keyboardService.keyChangeSelection(new KeyboardEvent('keydown', {
      code: codesLetter.ARROW_DOWN,
    }), this.range);
    if (!canFocus) {
      this.closeEdit();
    }
  }
  clearCell() {
    if (this.selectionStoreService.ranged && !isRangeSingleCell(this.selectionStoreService.ranged)) {
      const data = this.columnService.getRangeStaticData(this.selectionStoreService.ranged, '');
      this.autoFillService.onRangeApply(data, this.selectionStoreService.ranged);
    }
    else if (this.canEdit()) {
      const focused = this.selectionStoreService.focused;
      const cell = this.columnService.getSaveData(focused.y, focused.x);
      this.cellEdit({
        rgRow: focused.y,
        rgCol: focused.x,
        val: '',
        type: cell.type,
        prop: cell.prop,
      });
    }
  }
  onRowDragStart({ detail }) {
    detail.text = this.columnService.getCellData(detail.cell.y, detail.cell.x);
  }
  /** Check if edit possible */
  canEdit() {
    var _a;
    if (this.readonly) {
      return false;
    }
    const editCell = this.selectionStoreService.focused;
    return editCell && !((_a = this.columnService) === null || _a === void 0 ? void 0 : _a.isReadOnly(editCell.y, editCell.x));
  }
  get types() {
    return {
      rowType: this.dataStore.get('type'),
      colType: this.columnService.type,
    };
  }
  /** Collect data from element */
  getData() {
    return {
      el: this.element,
      rows: this.dimensionRow.state,
      cols: this.dimensionCol.state,
      lastCell: this.lastCell,
    };
  }
  get element() { return getElement(this); }
  static get watchers() { return {
    "selectionStore": ["selectionServiceSet"],
    "dimensionRow": ["createAutoFillService"],
    "dimensionCol": ["createAutoFillService"],
    "dataStore": ["columnServiceSet"],
    "colData": ["columnServiceSet"]
  }; }
};
OverlaySelection.style = revogrOverlayStyleCss;

const RowHeaderRender = s => (__, { rowIndex: i }) => s + i;

const RevogrRowHeaders = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.scrollViewport = createEvent(this, "scrollViewport", 3);
    this.elementToScroll = createEvent(this, "elementToScroll", 3);
    this.height = undefined;
    this.dataPorts = undefined;
    this.headerProp = undefined;
    this.uiid = undefined;
    this.rowClass = undefined;
    this.resize = undefined;
    this.rowHeaderColumn = undefined;
    this.additionalData = undefined;
  }
  render() {
    const dataViews = [];
    const viewport = new ViewportStore('colPinStart');
    /** render viewports rows */
    let totalLength = 1;
    for (let data of this.dataPorts) {
      const itemCount = data.dataStore.get('items').length;
      // initiate row data
      const dataStore = new DataStore(data.type);
      dataStore.updateData(data.dataStore.get('source'));
      // initiate column data
      const colData = new DataStore('colPinStart');
      const column = Object.assign({ cellTemplate: RowHeaderRender(totalLength) }, this.rowHeaderColumn);
      colData.updateData([column]);
      const viewData = Object.assign(Object.assign({}, data), { rowClass: this.rowClass, dataStore: dataStore.store, colData: colData.store, viewportCol: viewport.store, readonly: true, range: false });
      dataViews.push(h("revogr-data", Object.assign({}, viewData)));
      totalLength += itemCount;
    }
    const colSize = calculateRowHeaderSize(totalLength, this.rowHeaderColumn);
    viewport.setViewport({
      realCount: 1,
      virtualSize: 0,
      items: [
        {
          size: colSize,
          start: 0,
          end: colSize,
          itemIndex: 0,
        },
      ],
    });
    const parent = `${this.uiid}-rowHeaders`;
    const viewportScroll = {
      [UUID]: parent,
      contentHeight: this.height,
      contentWidth: 0,
      style: { minWidth: `${colSize}px` },
      ref: (el) => this.elementToScroll.emit(el),
      onScrollViewport: (e) => this.scrollViewport.emit(e.detail),
    };
    const viewportHeader = Object.assign(Object.assign({}, this.headerProp), { colData: typeof this.rowHeaderColumn === 'object' ? [this.rowHeaderColumn] : [], viewportCol: viewport.store, canResize: false, type: ROW_HEADER_TYPE, parent, slot: HEADER_SLOT });
    return (h(Host, { class: { [ROW_HEADER_TYPE]: true }, key: ROW_HEADER_TYPE }, h("revogr-viewport-scroll", Object.assign({}, viewportScroll, { "row-header": true }), h("revogr-header", Object.assign({}, viewportHeader)), dataViews)));
  }
};

const revogrScrollStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}revogr-scroll-virtual[auto-hide]{position:absolute;z-index:100}revogr-scroll-virtual[auto-hide].vertical{right:0;top:0}revogr-scroll-virtual[auto-hide].vertical:hover{min-width:20px}revogr-scroll-virtual[auto-hide].horizontal{bottom:0;left:0}revogr-scroll-virtual[auto-hide].horizontal:hover{min-height:20px}revogr-scroll-virtual.vertical{overflow-y:auto;overflow-x:hidden;height:100%}revogr-scroll-virtual.vertical>div{width:1px}revogr-scroll-virtual.horizontal{overflow-x:auto;overflow-y:hidden;width:100%}revogr-scroll-virtual.horizontal>div{height:1px}";

const RevogrScrollVirtual = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.scrollVirtual = createEvent(this, "scrollVirtual", 7);
    this.scrollSize = 0;
    this.isAutoHide = false;
    this.autoHideTimeout = 0;
    this.dimension = 'rgRow';
    this.viewportStore = undefined;
    this.dimensionStore = undefined;
  }
  async setScroll(e) {
    var _a;
    if (this.dimension !== e.dimension) {
      return;
    }
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.setScroll(e);
  }
  // update on delta in case we don't know existing position or external change
  async changeScroll(e) {
    if (e.delta) {
      switch (e.dimension) {
        case 'rgCol':
          e.coordinate = this.element.scrollLeft + e.delta;
          break;
        case 'rgRow':
          e.coordinate = this.element.scrollTop + e.delta;
          break;
      }
      this.setScroll(e);
    }
    return e;
  }
  set size(s) {
    if (this.dimension === 'rgRow') {
      this.element.style.minWidth = `${s}px`;
      return;
    }
    this.element.style.minHeight = `${s}px`;
  }
  get size() {
    if (this.dimension === 'rgRow') {
      return this.element.clientHeight;
    }
    return this.element.clientWidth;
  }
  connectedCallback() {
    this.scrollService = new LocalScrollService({
      beforeScroll: e => this.scrollVirtual.emit(e),
      afterScroll: e => {
        const type = e.dimension === 'rgRow' ? 'scrollTop' : 'scrollLeft';
        this.element[type] = e.coordinate;
      },
    });
  }
  disconnectedCallback() {
    clearTimeout(this.autoHideTimeout);
  }
  componentWillLoad() {
    this.scrollSize = getScrollbarWidth(document);
    this.isAutoHide = !this.scrollSize;
  }
  componentDidRender() {
    const type = this.dimension === 'rgRow' ? 'scrollHeight' : 'scrollWidth';
    if (this.element[type] > this.size) {
      this.size = this.scrollSize;
    }
    else {
      this.size = 0;
    }
    this.scrollService.setParams({
      contentSize: this.dimensionStore.get('realSize'),
      clientSize: this.size,
      virtualSize: this.viewportStore.get('virtualSize'),
    }, this.dimension);
  }
  onScroll(e) {
    var _a;
    let type = 'scrollLeft';
    if (this.dimension === 'rgRow') {
      type = 'scrollTop';
    }
    if (this.isAutoHide) {
      this.size = 20;
      this.autoHideTimeout = this.autoHide(this.autoHideTimeout);
    }
    const target = e.target;
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(target[type] || 0, this.dimension);
  }
  autoHide(timeout) {
    clearTimeout(timeout);
    return setTimeout(() => {
      this.size = 0;
    }, 6000);
  }
  render() {
    const sizeType = this.dimension === 'rgRow' ? 'height' : 'width';
    return (h(Host, Object.assign({}, { 'auto-hide': this.isAutoHide }, { onScroll: (e) => this.onScroll(e) }), h("div", { style: { [sizeType]: `${this.extContentSize(this.viewportStore.get('virtualSize'), this.dimensionStore.get('realSize'))}px` } })));
  }
  extContentSize(vsize, contentSize) {
    return LocalScrollService.getVirtualContentSize(contentSize, this.size, vsize);
  }
  get element() { return getElement(this); }
};
RevogrScrollVirtual.style = revogrScrollStyleCss;

const revogrTempRangeStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}.temp-bg-range{display:block !important;position:absolute;pointer-events:none;z-index:9;border:1px solid rgb(255, 94, 0);box-sizing:border-box}.temp-bg-range.Selection{border:1px dashed gray}.temp-bg-range>div{width:1px;height:1px;position:absolute}.temp-bg-range>div.top{top:-1px}.temp-bg-range>div.bottom{bottom:-1px}.temp-bg-range>div.left{left:-1px}.temp-bg-range>div.right{right:-1px}";

const RevogrFocus = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.onChange = lodash.throttle((e) => this.doChange(e), 300);
    this.selectionStore = undefined;
    this.dimensionRow = undefined;
    this.dimensionCol = undefined;
  }
  doChange(e) {
    e === null || e === void 0 ? void 0 : e.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    });
  }
  componentDidRender() {
    if (this.el) {
      this.onChange(this.el);
    }
  }
  render() {
    const data = this.selectionStore.get('tempRange');
    const type = this.selectionStore.get('tempRangeType');
    if (!data) {
      return;
    }
    let directionY = 'bottom';
    let derectionX = 'right';
    const range = this.getRange();
    if (!range) {
      return;
    }
    if (data.y < range.y) {
      directionY = 'top';
    }
    if (data.x < range.x) {
      derectionX = 'left';
    }
    const directionClass = `${derectionX} ${directionY}`;
    const style = getElStyle(data, this.dimensionRow.state, this.dimensionCol.state);
    return (h(Host, { class: {
        [TMP_SELECTION_BG_CLASS]: true,
        [type || '']: true,
      }, style: style, hidden: false }, h("div", { class: directionClass, ref: (e) => (this.el = e) })));
  }
  getRange() {
    const range = this.selectionStore.get('range');
    if (range) {
      return range;
    }
    const focus = this.selectionStore.get('focus');
    if (!focus) {
      return null;
    }
    return Object.assign(Object.assign({}, focus), { x1: focus.x, y1: focus.y });
  }
};
RevogrFocus.style = revogrTempRangeStyleCss;

export { RevogrFocus$1 as revogr_focus, OverlaySelection as revogr_overlay_selection, RevogrRowHeaders as revogr_row_headers, RevogrScrollVirtual as revogr_scroll_virtual, RevogrFocus as revogr_temp_range };

//# sourceMappingURL=revogr-focus_5.entry.js.map