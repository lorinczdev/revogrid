/*!
 * Built by Revolist
 */
import { h, Host } from "@stencil/core";
import { EDIT_INPUT_WR } from "../../utils/consts";
import { TextEditor } from "./editors/text";
/**
 * Cell editor component
 */
export class RevoEdit {
  constructor() {
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
  static get is() { return "revogr-edit"; }
  static get originalStyleUrls() {
    return {
      "$": ["revogr-edit-style.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["revogr-edit-style.css"]
    };
  }
  static get properties() {
    return {
      "editCell": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Edition.EditCell",
          "resolved": "EditCellStore & BeforeSaveDataDetails",
          "references": {
            "Edition": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Edition"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
      "column": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.ColumnRegular | null",
          "resolved": "ColumnRegular",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
      "editor": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Edition.EditorCtr | null",
          "resolved": "EditorCtr",
          "references": {
            "Edition": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Edition"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Custom editors register"
        }
      },
      "saveOnClose": {
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
          "text": "Save on editor close"
        },
        "attribute": "save-on-close",
        "reflect": false,
        "defaultValue": "false"
      },
      "additionalData": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Additional data to pass to renderer"
        },
        "attribute": "additional-data",
        "reflect": false
      }
    };
  }
  static get events() {
    return [{
        "method": "cellEdit",
        "name": "cellEdit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Cell edit event"
        },
        "complexType": {
          "original": "Edition.SaveDataDetails",
          "resolved": "{ rgRow: number; rgCol: number; type: DimensionRows; prop: ColumnProp; val: any; preventFocus?: boolean; }",
          "references": {
            "Edition": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Edition"
            }
          }
        }
      }, {
        "method": "closeEdit",
        "name": "closeEdit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Close editor event\npass true if requires focus next"
        },
        "complexType": {
          "original": "boolean | undefined",
          "resolved": "boolean",
          "references": {}
        }
      }];
  }
  static get methods() {
    return {
      "cancel": {
        "complexType": {
          "signature": "() => Promise<void>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
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
  static get elementRef() { return "element"; }
}
//# sourceMappingURL=revogr-edit.js.map
