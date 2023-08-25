/*!
 * Built by Revolist
 */
import { h, Host } from "@stencil/core";
import DataStore from "../../store/dataSource/data.store";
import ViewportStore from "../../store/viewPort/viewport.store";
import { ROW_HEADER_TYPE, UUID } from "../../utils/consts";
import { RowHeaderRender } from "./row-header-render";
import { calculateRowHeaderSize } from "../../utils/row-header-utils";
import { HEADER_SLOT } from "../revoGrid/viewport.helpers";
/**
 * Row headers component
 * Visible on the left side of the table
 */
export class RevogrRowHeaders {
  constructor() {
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
  static get is() { return "revogr-row-headers"; }
  static get properties() {
    return {
      "height": {
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
        "attribute": "height",
        "reflect": false
      },
      "dataPorts": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "ViewportData[]",
          "resolved": "ViewportData[]",
          "references": {
            "ViewportData": {
              "location": "import",
              "path": "../revoGrid/viewport.interfaces",
              "id": "src/components/revoGrid/viewport.interfaces.ts::ViewportData"
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
      "headerProp": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Record<string, any>",
          "resolved": "{ [x: string]: any; }",
          "references": {
            "Record": {
              "location": "global",
              "id": "global::Record"
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
      "uiid": {
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
        "attribute": "uiid",
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
          "text": ""
        },
        "attribute": "row-class",
        "reflect": false
      },
      "resize": {
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
        "attribute": "resize",
        "reflect": false
      },
      "rowHeaderColumn": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.RowHeaders",
          "resolved": "RowHeaders",
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
        "method": "scrollViewport",
        "name": "scrollViewport",
        "bubbles": false,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "RevoGrid.ViewPortScrollEvent",
          "resolved": "{ dimension: DimensionType; coordinate: number; delta?: number; outside?: boolean; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "elementToScroll",
        "name": "elementToScroll",
        "bubbles": false,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "ElementScroll",
          "resolved": "ElementScroll",
          "references": {
            "ElementScroll": {
              "location": "import",
              "path": "../revoGrid/viewport.scrolling.service",
              "id": "src/components/revoGrid/viewport.scrolling.service.ts::ElementScroll"
            }
          }
        }
      }];
  }
}
//# sourceMappingURL=revogr-row-headers.js.map
