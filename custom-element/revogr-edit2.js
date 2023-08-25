/*!
 * Built by Revolist
 */
import { h, proxyCustomElement, HTMLElement, createEvent, Host } from '@stencil/core/internal/client';
import { E as EDIT_INPUT_WR } from './consts.js';
import './isObject.js';
import './_stringToPath.js';
import { t as timeout } from './index2.js';

var codes;
(function (codes) {
  codes[codes["MOUSE_LEFT"] = 1] = "MOUSE_LEFT";
  codes[codes["MOUSE_RIGHT"] = 3] = "MOUSE_RIGHT";
  codes[codes["MOUSE_MIDDLE"] = 2] = "MOUSE_MIDDLE";
  codes[codes["BACKSPACE"] = 8] = "BACKSPACE";
  codes[codes["COMMA"] = 188] = "COMMA";
  codes[codes["INSERT"] = 45] = "INSERT";
  codes[codes["DELETE"] = 46] = "DELETE";
  codes[codes["END"] = 35] = "END";
  codes[codes["ENTER"] = 13] = "ENTER";
  codes[codes["ESCAPE"] = 27] = "ESCAPE";
  codes[codes["CONTROL"] = 17] = "CONTROL";
  codes[codes["COMMAND_LEFT"] = 91] = "COMMAND_LEFT";
  codes[codes["COMMAND_RIGHT"] = 93] = "COMMAND_RIGHT";
  codes[codes["COMMAND_FIREFOX"] = 224] = "COMMAND_FIREFOX";
  codes[codes["ALT"] = 18] = "ALT";
  codes[codes["HOME"] = 36] = "HOME";
  codes[codes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
  codes[codes["PAGE_UP"] = 33] = "PAGE_UP";
  codes[codes["PERIOD"] = 190] = "PERIOD";
  codes[codes["SPACE"] = 32] = "SPACE";
  codes[codes["SHIFT"] = 16] = "SHIFT";
  codes[codes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
  codes[codes["TAB"] = 9] = "TAB";
  codes[codes["ARROW_RIGHT"] = 39] = "ARROW_RIGHT";
  codes[codes["ARROW_LEFT"] = 37] = "ARROW_LEFT";
  codes[codes["ARROW_UP"] = 38] = "ARROW_UP";
  codes[codes["ARROW_DOWN"] = 40] = "ARROW_DOWN";
  codes[codes["F1"] = 112] = "F1";
  codes[codes["F2"] = 113] = "F2";
  codes[codes["F3"] = 114] = "F3";
  codes[codes["F4"] = 115] = "F4";
  codes[codes["F5"] = 116] = "F5";
  codes[codes["F6"] = 117] = "F6";
  codes[codes["F7"] = 118] = "F7";
  codes[codes["F8"] = 119] = "F8";
  codes[codes["F9"] = 120] = "F9";
  codes[codes["F10"] = 121] = "F10";
  codes[codes["F11"] = 122] = "F11";
  codes[codes["F12"] = 123] = "F12";
  codes[codes["A"] = 65] = "A";
  codes[codes["C"] = 67] = "C";
  codes[codes["D"] = 68] = "D";
  codes[codes["F"] = 70] = "F";
  codes[codes["L"] = 76] = "L";
  codes[codes["O"] = 79] = "O";
  codes[codes["P"] = 80] = "P";
  codes[codes["S"] = 83] = "S";
  codes[codes["V"] = 86] = "V";
  codes[codes["X"] = 88] = "X";
})(codes || (codes = {}));
var codesLetter;
(function (codesLetter) {
  codesLetter["ENTER"] = "Enter";
  codesLetter["ENTER_NUM"] = "NumpadEnter";
  codesLetter["A"] = "KeyA";
  codesLetter["C"] = "KeyC";
  codesLetter["X"] = "KeyX";
  codesLetter["V"] = "KeyV";
  codesLetter["ESCAPE"] = "Escape";
  codesLetter["TAB"] = "Tab";
  codesLetter["BACKSPACE"] = "Backspace";
  codesLetter["DELETE"] = "Delete";
  codesLetter["ARROW_RIGHT"] = "ArrowRight";
  codesLetter["ARROW_LEFT"] = "ArrowLeft";
  codesLetter["ARROW_UP"] = "ArrowUp";
  codesLetter["ARROW_DOWN"] = "ArrowDown";
  codesLetter["SHIFT"] = "Shift";
})(codesLetter || (codesLetter = {}));

var osPlatform;
(function (osPlatform) {
  osPlatform["mac"] = "Mac";
})(osPlatform || (osPlatform = {}));

function isLetterKey(code) {
  return (code === 32 || // space
    (code >= 48 && code <= 57) ||
    (code >= 96 && code <= 111) ||
    (code >= 186 && code <= 192) ||
    (code >= 219 && code <= 222) ||
    code >= 226 ||
    (code >= 65 && code <= 90)); // a-z
}
function isClear(code) {
  return codesLetter.BACKSPACE === code || codesLetter.DELETE === code;
}
function isTab(code) {
  return codesLetter.TAB === code;
}
function isEnterKey(code) {
  return code === codesLetter.ENTER || code === codesLetter.ENTER_NUM;
}
function isCut(event) {
  return (event.ctrlKey && event.key === 'x') || // Ctrl + X on Windows
    (event.metaKey && event.key === 'x'); // Cmd + X on Mac
}
function isCopy(event) {
  return (event.ctrlKey && event.key === 'c') || // Ctrl + C on Windows
    (event.metaKey && event.key === 'c'); // Cmd + C on Mac
}
function isPaste(event) {
  return (event.ctrlKey && event.key === 'v') || // Ctrl + V on Windows
    (event.metaKey && event.key === 'v'); // Cmd + V on Mac
}
function isAll(event) {
  return (event.ctrlKey && event.key === 'a') || // Ctrl + A on Windows
    (event.metaKey && event.key === 'a'); // Cmd + A on Mac
}

class TextEditor {
  constructor(column, saveCallback) {
    this.column = column;
    this.saveCallback = saveCallback;
    this.element = null;
    this.editCell = null;
  }
  async componentDidRender() {
    var _a;
    if (this.editInput) {
      await timeout();
      (_a = this.editInput) === null || _a === void 0 ? void 0 : _a.focus();
    }
  }
  onKeyDown(e) {
    const isEnter = isEnterKey(e.code);
    const isKeyTab = isTab(e.code);
    if ((isKeyTab || isEnter) && e.target && this.saveCallback && !e.isComposing) {
      // blur is needed to avoid autoscroll
      this.editInput.blur();
      // request callback which will close cell after all
      this.saveCallback(this.getValue(), isKeyTab);
    }
  }
  getValue() {
    var _a;
    return (_a = this.editInput) === null || _a === void 0 ? void 0 : _a.value;
  }
  // required
  render() {
    var _a;
    return (h("input", { type: "text", value: ((_a = this.editCell) === null || _a === void 0 ? void 0 : _a.val) || '', ref: el => {
        this.editInput = el;
      }, onKeyDown: e => this.onKeyDown(e) }));
  }
}

const revogrEditStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}revogr-edit{display:block;position:absolute;background-color:#fff}revogr-edit input{height:100%;width:100%;box-sizing:border-box}revogr-edit revo-dropdown{height:100%}revogr-edit revo-dropdown.shrink fieldset legend>span{display:none}";

const RevoEdit = /*@__PURE__*/ proxyCustomElement(class RevoEdit extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.cellEdit = createEvent(this, "cellEdit", 7);
    this.closeEdit = createEvent(this, "closeEdit", 7);
    /** Edit session editor */
    this.currentEditor = null;
    this.saveRunning = false;
    this.editCell = undefined;
    this.column = undefined;
    this.editor = undefined;
    this.saveOnClose = false;
    this.additionalData = undefined;
  }
  async cancel() {
    this.saveRunning = true;
  }
  onAutoSave() {
    this.saveRunning = true;
    const val = this.currentEditor.getValue && this.currentEditor.getValue();
    // for editor plugin internal usage in case you want to stop save and use your own
    if (this.currentEditor.beforeAutoSave) {
      const canSave = this.currentEditor.beforeAutoSave(val);
      if (canSave === false) {
        return;
      }
    }
    this.onSave(val, true);
  }
  /**
   * Callback triggered on cell editor save
   * Closes editor when called
   * @param preventFocus - if true editor will not be closed and next cell will not be focused
   */
  onSave(val, preventFocus) {
    this.saveRunning = true;
    if (this.editCell) {
      this.cellEdit.emit({
        rgCol: this.editCell.x,
        rgRow: this.editCell.y,
        type: this.editCell.type,
        prop: this.editCell.prop,
        val,
        preventFocus,
      });
    }
  }
  componentWillRender() {
    // we have active editor
    if (this.currentEditor) {
      return;
    }
    this.saveRunning = false;
    // custom editor usage
    // use TextEditor (editors/text.tsx) to create custom editor
    if (this.editor) {
      this.currentEditor = new this.editor(this.column, 
      // save
      (e, preventFocus) => {
        this.onSave(e, preventFocus);
      }, 
      // cancel
      focusNext => {
        this.saveRunning = true;
        this.closeEdit.emit(focusNext);
      });
      return;
    }
    // default text editor usage
    this.currentEditor = new TextEditor(this.column, (e, preventFocus) => this.onSave(e, preventFocus));
  }
  componentDidRender() {
    var _a, _b;
    if (!this.currentEditor) {
      return;
    }
    this.currentEditor.element = this.element.firstElementChild;
    (_b = (_a = this.currentEditor).componentDidRender) === null || _b === void 0 ? void 0 : _b.call(_a);
  }
  disconnectedCallback() {
    if (this.saveOnClose) {
      // shouldn't be cancelled by saveRunning
      // editor requires getValue to be able to save
      if (!this.saveRunning) {
        this.onAutoSave();
      }
    }
    this.saveRunning = false;
    if (!this.currentEditor) {
      return;
    }
    this.currentEditor.disconnectedCallback && this.currentEditor.disconnectedCallback();
    if (this.currentEditor.element) {
      this.currentEditor.element = null;
    }
    this.currentEditor = null;
  }
  render() {
    if (this.currentEditor) {
      this.currentEditor.editCell = this.editCell;
      return h(Host, { class: EDIT_INPUT_WR }, this.currentEditor.render(h, this.additionalData));
    }
    return '';
  }
  get element() { return this; }
  static get style() { return revogrEditStyleCss; }
}, [0, "revogr-edit", {
    "editCell": [16],
    "column": [16],
    "editor": [16],
    "saveOnClose": [4, "save-on-close"],
    "additionalData": [8, "additional-data"],
    "cancel": [64]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["revogr-edit"];
  components.forEach(tagName => { switch (tagName) {
    case "revogr-edit":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, RevoEdit);
      }
      break;
  } });
}

export { RevoEdit as R, isEnterKey as a, isCopy as b, codesLetter as c, defineCustomElement as d, isCut as e, isPaste as f, isAll as g, isLetterKey as h, isClear as i };

//# sourceMappingURL=revogr-edit2.js.map