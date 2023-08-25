/*!
 * Built by Revolist
 */
import { h, Host } from "@stencil/core";
import { throttle } from "lodash";
import { TMP_SELECTION_BG_CLASS } from "../../utils/consts";
import { getElStyle } from "../overlay/selection.utils";
/**
 * Temporary range selection
 */
export class RevogrFocus {
  constructor() {
    this.onChange = throttle((e) => this.doChange(e), 300);
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
  static get is() { return "revogr-temp-range"; }
  static get originalStyleUrls() {
    return {
      "$": ["revogr-temp-range-style.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["revogr-temp-range-style.css"]
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
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Selection store, shows current selection and focus"
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
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Dimension row store"
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
          "text": "Dimension column store"
        }
      }
    };
  }
}
//# sourceMappingURL=revogr-temp-range.js.map
