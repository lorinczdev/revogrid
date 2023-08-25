export class Clipboard {
  constructor() {
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
  static get is() { return "revogr-clipboard"; }
  static get properties() {
    return {
      "readonly": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean",
          "resolved": "boolean",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "If readonly mode enables no need for Paste event"
        },
        "attribute": "readonly",
        "reflect": false
      }
    };
  }
  static get events() {
    return [{
        "method": "pasteRegion",
        "name": "pasteRegion",
        "bubbles": false,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "event",
              "text": "pasteregion"
            }, {
              "name": "property",
              "text": "{string[][]} data - data to paste"
            }, {
              "name": "property",
              "text": "{boolean} defaultPrevented - if true, paste will be canceled"
            }],
          "text": "Fired when region pasted"
        },
        "complexType": {
          "original": "string[][]",
          "resolved": "string[][]",
          "references": {}
        }
      }, {
        "method": "beforePaste",
        "name": "beforepaste",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "event",
              "text": "beforepaste"
            }, {
              "name": "property",
              "text": "{string} raw - raw data from clipboard"
            }, {
              "name": "property",
              "text": "{ClipboardEvent} event - original event"
            }, {
              "name": "property",
              "text": "{boolean} defaultPrevented - if true, paste will be canceled"
            }],
          "text": "Fired before paste applied to the grid"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "beforePasteApply",
        "name": "beforepasteapply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "event",
              "text": "beforepasteapply"
            }, {
              "name": "property",
              "text": "{string} raw - raw data from clipboard"
            }, {
              "name": "property",
              "text": "{string[][]} parsed - parsed data"
            }],
          "text": "Fired before paste applied to the grid and after data parsed"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "afterPasteApply",
        "name": "afterpasteapply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "event",
              "text": "afterpasteapply"
            }, {
              "name": "property",
              "text": "{string} raw - raw data from clipboard"
            }, {
              "name": "property",
              "text": "{string[][]} parsed - parsed data"
            }, {
              "name": "property",
              "text": "{ClipboardEvent} event - original event"
            }, {
              "name": "property",
              "text": "{boolean} defaultPrevented - if true, paste will be canceled"
            }],
          "text": "Fired after paste applied to the grid"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "beforeCut",
        "name": "beforecut",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "event",
              "text": "beforecopy"
            }, {
              "name": "property",
              "text": "{ClipboardEvent} event - original event"
            }, {
              "name": "property",
              "text": "{boolean} defaultPrevented - if true, cut will be canceled"
            }],
          "text": "Fired before cut triggered"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "clearRegion",
        "name": "clearRegion",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Clears region when cut is done"
        },
        "complexType": {
          "original": "DataTransfer",
          "resolved": "DataTransfer",
          "references": {
            "DataTransfer": {
              "location": "global",
              "id": "global::DataTransfer"
            }
          }
        }
      }, {
        "method": "beforeCopy",
        "name": "beforecopy",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "event",
              "text": "beforecopy"
            }, {
              "name": "property",
              "text": "{ClipboardEvent} event - original event"
            }, {
              "name": "property",
              "text": "{boolean} defaultPrevented - if true, copy will be canceled"
            }],
          "text": "Fired before copy triggered"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "beforeCopyApply",
        "name": "beforecopyapply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "event",
              "text": "beforecopyapply"
            }, {
              "name": "property",
              "text": "{DataTransfer} event - original event"
            }, {
              "name": "property",
              "text": "{string} data - data to copy"
            }, {
              "name": "property",
              "text": "{boolean} defaultPrevented - if true, copy will be canceled"
            }],
          "text": "Fired before copy applied to the clipboard"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "copyRegion",
        "name": "copyRegion",
        "bubbles": false,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [{
              "name": "event",
              "text": "copyregion"
            }, {
              "name": "property",
              "text": "{DataTransfer} data - data to copy"
            }, {
              "name": "property",
              "text": "{boolean} defaultPrevented - if true, copy will be canceled"
            }],
          "text": "Fired when region copied"
        },
        "complexType": {
          "original": "DataTransfer",
          "resolved": "DataTransfer",
          "references": {
            "DataTransfer": {
              "location": "global",
              "id": "global::DataTransfer"
            }
          }
        }
      }];
  }
  static get methods() {
    return {
      "doCopy": {
        "complexType": {
          "signature": "(e: DataTransfer, data?: RevoGrid.DataFormat[][]) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }, {
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "DataTransfer": {
              "location": "global",
              "id": "global::DataTransfer"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "",
          "tags": []
        }
      }
    };
  }
  static get listeners() {
    return [{
        "name": "paste",
        "method": "onPaste",
        "target": "document",
        "capture": false,
        "passive": false
      }, {
        "name": "copy",
        "method": "copyStarted",
        "target": "document",
        "capture": false,
        "passive": false
      }, {
        "name": "cut",
        "method": "cutStarted",
        "target": "document",
        "capture": false,
        "passive": false
      }];
  }
}
//# sourceMappingURL=revogr-clipboard.js.map
