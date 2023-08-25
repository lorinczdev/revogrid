/*!
 * Built by Revolist
 */
import { h } from "@stencil/core";
import keyBy from "lodash/keyBy";
import { HEADER_ACTUAL_ROW_CLASS, HEADER_ROW_CLASS } from "../../utils/consts";
import HeaderRenderer from "./headerRenderer";
import ColumnGroupsRenderer from "../../plugins/groupingColumn/columnGroupsRenderer";
export class RevogrHeaderComponent {
  constructor() {
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
    const cols = keyBy(this.viewportCol.get('items'), 'itemIndex');
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
  static get is() { return "revogr-header"; }
  static get originalStyleUrls() {
    return {
      "$": ["revogr-header-style.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["revogr-header-style.css"]
    };
  }
  static get properties() {
    return {
      "viewportCol": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Observable<RevoGrid.ViewportState>",
          "resolved": "ObservableMap<ViewportState>",
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
        "required": false,
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
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
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
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
      "parent": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "string",
          "resolved": "string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "parent",
        "reflect": false,
        "defaultValue": "''"
      },
      "groups": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Groups",
          "resolved": "{ [x: string]: any; }",
          "references": {
            "Groups": {
              "location": "import",
              "path": "../../store/dataSource/data.store",
              "id": "src/store/dataSource/data.store.ts::Groups"
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
      "groupingDepth": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "grouping-depth",
        "reflect": false,
        "defaultValue": "0"
      },
      "canResize": {
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
          "text": "If columns can be resized"
        },
        "attribute": "can-resize",
        "reflect": false
      },
      "resizeHandler": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "ResizeProps['active']",
          "resolved": "(\"b\" | \"rt\" | \"lt\" | \"r\" | \"rb\" | \"lb\" | \"l\" | \"t\")[]",
          "references": {
            "ResizeProps": {
              "location": "import",
              "path": "../../services/resizable.directive",
              "id": "src/services/resizable.directive.tsx::ResizeProps"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Define custom resize position"
        }
      },
      "colData": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.ColumnRegular[]",
          "resolved": "ColumnRegular[]",
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
      "columnFilter": {
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
          "text": ""
        },
        "attribute": "column-filter",
        "reflect": false
      },
      "type": {
        "type": "string",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.DimensionCols | 'rowHeaders'",
          "resolved": "\"colPinEnd\" | \"colPinStart\" | \"rgCol\" | \"rowHeaders\"",
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
          "text": "Column type"
        },
        "attribute": "type",
        "reflect": false
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
          "text": "Extra properties to pass into header renderer, such as vue or react components to handle parent"
        },
        "attribute": "additional-data",
        "reflect": false,
        "defaultValue": "{}"
      }
    };
  }
  static get events() {
    return [{
        "method": "initialHeaderClick",
        "name": "initialHeaderClick",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "RevoGrid.InitialHeaderClick",
          "resolved": "{ index: number; originalEvent: MouseEvent; column: ColumnRegular; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "headerresize",
        "name": "headerresize",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "RevoGrid.ViewSettingSizeProp",
          "resolved": "{ [x: string]: number; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "beforeResize",
        "name": "before-resize",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "RevoGrid.ColumnRegular[]",
          "resolved": "ColumnRegular[]",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "headerdblClick",
        "name": "headerdblClick",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "RevoGrid.InitialHeaderClick",
          "resolved": "{ index: number; originalEvent: MouseEvent; column: ColumnRegular; }",
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
  static get elementRef() { return "element"; }
}
//# sourceMappingURL=revogr-header.js.map
