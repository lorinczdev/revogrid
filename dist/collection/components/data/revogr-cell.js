/*!
 * Built by Revolist
 */
import { h, Host } from "@stencil/core";
import { DATA_COL, DATA_ROW, DRAGGABLE_CLASS, DRAG_ICON_CLASS, } from "../../utils/consts";
import ColumnService from "./columnService";
import { PADDING_DEPTH } from "./rowRenderer";
/**
 * Component is responsible for rendering cell
 * Main purpose is to track changes and understand what exactly need to be rerendered instead of full grid render
 */
export class RevogridCellRenderer {
  constructor() {
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
  static get is() { return "revogr-cell"; }
  static get properties() {
    return {
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
      "columnService": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "ColumnService",
          "resolved": "ColumnService",
          "references": {
            "ColumnService": {
              "location": "global",
              "id": "global::ColumnService"
            }
          }
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Column service"
        }
      },
      "providers": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.Providers",
          "resolved": "{ type: DimensionRows; data: ColumnRegular[] | Observable<DataSourceState<any, any>>; viewport: Observable<ViewportState>; dimension: Observable<DimensionSettingsState>; selection: Observable<SelectionStoreState>; }",
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
          "text": "Cached providers"
        }
      },
      "depth": {
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
          "text": "Grouping"
        },
        "attribute": "depth",
        "reflect": false
      },
      "rowIndex": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Row props passed via property"
        },
        "attribute": "row-index",
        "reflect": false
      },
      "rowStart": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "row-start",
        "reflect": false
      },
      "rowEnd": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "row-end",
        "reflect": false
      },
      "rowSize": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "row-size",
        "reflect": false
      },
      "colIndex": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Column props passed via property"
        },
        "attribute": "col-index",
        "reflect": false
      },
      "colStart": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "col-start",
        "reflect": false
      },
      "colEnd": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "col-end",
        "reflect": false
      },
      "colSize": {
        "type": "number",
        "mutable": false,
        "complexType": {
          "original": "number",
          "resolved": "number",
          "references": {}
        },
        "required": true,
        "optional": false,
        "docs": {
          "tags": [],
          "text": ""
        },
        "attribute": "col-size",
        "reflect": false
      }
    };
  }
  static get events() {
    return [{
        "method": "beforeCellRender",
        "name": "before-cell-render",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before each cell render function. Allows to override cell properties"
        },
        "complexType": {
          "original": "BeforeCellRenderEvent",
          "resolved": "BeforeCellRenderEvent",
          "references": {
            "BeforeCellRenderEvent": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::BeforeCellRenderEvent"
            }
          }
        }
      }, {
        "method": "dragStartCell",
        "name": "dragStartCell",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "DragStartEvent",
          "resolved": "{ originalEvent: MouseEvent; model: ColumnDataSchemaModel; }",
          "references": {
            "DragStartEvent": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::DragStartEvent"
            }
          }
        }
      }];
  }
}
function isRowDragService(rowDrag, model) {
  if (typeof rowDrag === 'function') {
    return rowDrag(model);
  }
  return !!rowDrag;
}
//# sourceMappingURL=revogr-cell.js.map
