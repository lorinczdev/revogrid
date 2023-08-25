/*!
 * Built by Revolist
 */
import { proxyCustomElement, HTMLElement, createEvent } from '@stencil/core/internal/client';

const Clipboard = /*@__PURE__*/ proxyCustomElement(class Clipboard extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.pasteRegion = createEvent(this, "pasteRegion", 3);
    this.beforePaste = createEvent(this, "beforepaste", 7);
    this.beforePasteApply = createEvent(this, "beforepasteapply", 7);
    this.afterPasteApply = createEvent(this, "afterpasteapply", 7);
    this.beforeCut = createEvent(this, "beforecut", 7);
    this.clearRegion = createEvent(this, "clearRegion", 7);
    this.beforeCopy = createEvent(this, "beforecopy", 7);
    this.beforeCopyApply = createEvent(this, "beforecopyapply", 7);
    this.copyRegion = createEvent(this, "copyRegion", 3);
    this.readonly = undefined;
  }
  onPaste(e) {
    // if readonly do nothing
    if (this.readonly) {
      return;
    }
    const clipboardData = this.getData(e);
    const isHTML = clipboardData.types.indexOf('text/html') > -1;
    const data = isHTML ? clipboardData.getData('text/html') : clipboardData.getData('text');
    const dataText = clipboardData.getData('text');
    const beforePaste = this.beforePaste.emit({
      raw: data,
      dataText,
      isHTML,
      event: e,
    });
    if (beforePaste.defaultPrevented) {
      return;
    }
    let parsedData;
    // if html, then search for table if no table fallback to regular text parsing
    if (beforePaste.detail.isHTML) {
      const table = this.htmlParse(beforePaste.detail.raw);
      parsedData = table || this.textParse(dataText);
    }
    else {
      parsedData = this.textParse(beforePaste.detail.raw);
    }
    const beforePasteApply = this.beforePasteApply.emit({
      raw: data,
      parsed: parsedData,
      event: e,
    });
    if (beforePasteApply.defaultPrevented) {
      return;
    }
    this.pasteRegion.emit(beforePasteApply.detail.parsed);
    // post paste action
    const afterPasteApply = this.afterPasteApply.emit({
      raw: data,
      parsed: parsedData,
      event: e,
    });
    // keep default behavior if needed
    if (afterPasteApply.defaultPrevented) {
      return;
    }
    e.preventDefault();
  }
  /**
   * Listen to copy event and emit copy region event
   */
  copyStarted(e) {
    const beforeCopy = this.beforeCopy.emit({
      event: e,
    });
    if (beforeCopy.defaultPrevented) {
      return;
    }
    const data = this.getData(beforeCopy.detail.event);
    this.copyRegion.emit(data);
    e.preventDefault();
  }
  /**
   * Listen to copy event and emit copy region event
   */
  cutStarted(e) {
    const beforeCut = this.beforeCut.emit({
      event: e,
    });
    if (beforeCut.defaultPrevented) {
      return;
    }
    const data = this.getData(beforeCut.detail.event);
    this.copyStarted(e);
    // if readonly do nothing
    if (this.readonly) {
      return;
    }
    this.clearRegion.emit(data);
    e.preventDefault();
  }
  async doCopy(e, data) {
    const beforeCopyApply = this.beforeCopyApply.emit({
      event: e,
      data,
    });
    if (beforeCopyApply.defaultPrevented) {
      return;
    }
    const parsed = data ? this.parserCopy(data) : '';
    e.setData('text/plain', parsed);
  }
  parserCopy(data) {
    return data.map(rgRow => rgRow.join('\t')).join('\n');
  }
  textParse(data) {
    const result = [];
    const rows = data.split(/\r\n|\n|\r/);
    for (let y in rows) {
      result.push(rows[y].split('\t'));
    }
    return result;
  }
  htmlParse(data) {
    const result = [];
    const fragment = document.createRange().createContextualFragment(data);
    const table = fragment.querySelector('table');
    if (!table) {
      return null;
    }
    for (const rgRow of Array.from(table.rows)) {
      result.push(Array.from(rgRow.cells).map(cell => cell.innerText));
    }
    return result;
  }
  getData(e) {
    return e.clipboardData || (window === null || window === void 0 ? void 0 : window.clipboardData);
  }
}, [0, "revogr-clipboard", {
    "readonly": [4],
    "doCopy": [64]
  }, [[4, "paste", "onPaste"], [4, "copy", "copyStarted"], [4, "cut", "cutStarted"]]]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["revogr-clipboard"];
  components.forEach(tagName => { switch (tagName) {
    case "revogr-clipboard":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, Clipboard);
      }
      break;
  } });
}

const RevogrClipboard = Clipboard;
const defineCustomElement = defineCustomElement$1;

export { RevogrClipboard, defineCustomElement };

//# sourceMappingURL=revogr-clipboard.js.map