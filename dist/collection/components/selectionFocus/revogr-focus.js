/*!
 * Built by Revolist
 */
import { h, Host } from "@stencil/core";
import { FOCUS_CLASS } from "../../utils/consts";
import { getElStyle } from "../overlay/selection.utils";
import { getSourceItem } from "../../store/dataSource/data.store";
export class RevogrFocus {
  constructor() {
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
  static get is() { return "revogr-focus"; }
  static get originalStyleUrls() {
    return {
      "$": ["revogr-focus-style.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["revogr-focus-style.css"]
    };
  }
  static get properties() {
    return {
      "selectionStore": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Observable<Selection.SelectionStoreState>",
          "resolved": "ObservableMap<SelectionStoreState>",
          "references": {
            "Observable": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Observable"
            },
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Dynamic stores"
        }
      },
      "dimensionRow": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Observable<RevoGrid.DimensionSettingsState>",
          "resolved": "ObservableMap<DimensionSettingsState>",
          "references": {
            "Observable": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Observable"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
      "dimensionCol": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Observable<RevoGrid.DimensionSettingsState>",
          "resolved": "ObservableMap<DimensionSettingsState>",
          "references": {
            "Observable": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Observable"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
      "dataStore": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RowSource",
          "resolved": "ObservableMap<DataSourceState<DataType, DimensionRows>>",
          "references": {
            "RowSource": {
              "location": "import",
              "path": "../data/columnService",
              "id": "src/components/data/columnService.ts::RowSource"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
      "colData": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "ColumnSource",
          "resolved": "ObservableMap<DataSourceState<ColumnRegular, DimensionCols>>",
          "references": {
            "ColumnSource": {
              "location": "import",
              "path": "../data/columnService",
              "id": "src/components/data/columnService.ts::ColumnSource"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
      "colType": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.DimensionCols",
          "resolved": "\"colPinEnd\" | \"colPinStart\" | \"rgCol\"",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "col-type",
        "reflect": false
      },
      "rowType": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.DimensionRows",
          "resolved": "\"rgRow\" | \"rowPinEnd\" | \"rowPinStart\"",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "row-type",
        "reflect": false
      },
      "focusTemplate": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.FocusTemplateFunc | null",
          "resolved": "(createElement: HyperFunc<VNode>, detail: FocusRenderEvent) => any",
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
        },
        "defaultValue": "null"
      }
    };
  }
  static get events() {
    return [{
        "method": "beforeFocusRender",
        "name": "before-focus-render",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "FocusRenderEvent",
          "resolved": "FocusRenderEvent",
          "references": {
            "FocusRenderEvent": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::FocusRenderEvent"
            }
          }
        }
      }, {
        "method": "beforeScrollIntoView",
        "name": "beforescrollintoview",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before focus changed verify if it's in view and scroll viewport into this view\nCan be prevented by event.preventDefault()"
        },
        "complexType": {
          "original": "{ el: HTMLElement }",
          "resolved": "{ el: HTMLElement; }",
          "references": {
            "HTMLElement": {
              "location": "global",
              "id": "global::HTMLElement"
            }
          }
        }
      }, {
        "method": "afterFocus",
        "name": "afterfocus",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Used to setup properties after focus was rendered"
        },
        "complexType": {
          "original": "{\n    model: any;\n    column: RevoGrid.ColumnRegular;\n  }",
          "resolved": "{ model: any; column: ColumnRegular; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }];
  }
  static get elementRef() { return "el"; }
}
//# sourceMappingURL=revogr-focus.js.map
