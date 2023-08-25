/*!
 * Built by Revolist
 */
import { Host, h, } from "@stencil/core";
import ColumnService from "./columnService";
import { ROW_FOCUSED_CLASS } from "../../utils/consts";
import { getSourceItem } from "../../store/dataSource/data.store";
import RowRenderer from "./rowRenderer";
import GroupingRowRenderer from "../../plugins/groupingRow/grouping.row.renderer";
import { isGrouping } from "../../plugins/groupingRow/grouping.service";
/**
 * This component is responsible for rendering data
 * Rows, columns, groups and cells
 */
export class RevogrData {
  constructor() {
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
  static get is() { return "revogr-data"; }
  static get originalStyleUrls() {
    return {
      "$": ["revogr-data-style.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["revogr-data-style.css"]
    };
  }
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
          "text": "If readonly mode enables"
        },
        "attribute": "readonly",
        "reflect": false
      },
      "range": {
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
          "text": "Range selection mode"
        },
        "attribute": "range",
        "reflect": false
      },
      "rowClass": {
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
          "text": "Defines property from which to read row class"
        },
        "attribute": "row-class",
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
          "text": "Additional data to pass to renderer\nUsed in plugins such as vue or react to pass root app entity to cells"
        },
        "attribute": "additional-data",
        "reflect": false
      },
      "rowSelectionStore": {
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
          "text": ""
        }
      },
      "viewportRow": {
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
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        }
      },
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
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
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
      "colData": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "ColumnSource",
          "resolved": "ObservableMap<DataSourceState<ColumnRegular, DimensionCols>>",
          "references": {
            "ColumnSource": {
              "location": "import",
              "path": "./columnService",
              "id": "src/components/data/columnService.ts::ColumnSource"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Static stores, not expected to change during component lifetime"
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
              "path": "./columnService",
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
      "type": {
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
        "attribute": "type",
        "reflect": false
      }
    };
  }
  static get states() {
    return {
      "providers": {}
    };
  }
  static get events() {
    return [{
        "method": "beforeRowRender",
        "name": "beforeRowRender",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before each row render"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "afterrender",
        "name": "afterrender",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "When data render finished for the designated type"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }];
  }
  static get elementRef() { return "element"; }
  static get watchers() {
    return [{
        "propName": "dataStore",
        "methodName": "onStoreChange"
      }, {
        "propName": "colData",
        "methodName": "onStoreChange"
      }];
  }
}
//# sourceMappingURL=revogr-data.js.map
