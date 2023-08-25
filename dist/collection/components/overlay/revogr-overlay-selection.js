/*!
 * Built by Revolist
 */
import { h, Host } from "@stencil/core";
import ColumnService from "../data/columnService";
import SelectionStoreService from "../../store/selection/selection.store.service";
import { codesLetter } from "../../utils/keyCodes";
import { MOBILE_CLASS, SELECTION_BORDER_CLASS } from "../../utils/consts";
import { isRangeSingleCell } from "../../store/selection/selection.helpers";
import { getCurrentCell, getElStyle } from "./selection.utils";
import { isEditInput } from "./editors/edit.utils";
import { KeyboardService } from "./keyboard.service";
import { AutoFillService } from "./autofill.service";
import { ClipboardService } from "./clipboard.service";
import { getFromEvent, verifyTouchTarget } from "../../utils/events";
export class OverlaySelection {
  constructor() {
    this.keyboardService = null;
    this.autoFillService = null;
    this.clipboardService = null;
    this.revogrEdit = null;
    this.readonly = undefined;
    this.range = undefined;
    this.canDrag = undefined;
    this.useClipboard = undefined;
    this.selectionStore = undefined;
    this.dimensionRow = undefined;
    this.dimensionCol = undefined;
    this.dataStore = undefined;
    this.colData = undefined;
    this.lastCell = undefined;
    this.editors = undefined;
    this.applyChangesOnClose = false;
    this.additionalData = undefined;
    this.isMobileDevice = undefined;
  }
  // --------------------------------------------------------------------------
  //
  //  Listeners
  //
  // --------------------------------------------------------------------------
  onMouseMove(e) {
    if (this.selectionStoreService.focused) {
      this.autoFillService.selectionMouseMove(e);
    }
  }
  /** Action finished inside of the document */
  /** Pointer left document, clear any active operation */
  onMouseUp() {
    this.autoFillService.clearAutoFillSelection();
  }
  /** Row drag started */
  onCellDrag(e) {
    var _a;
    (_a = this.orderEditor) === null || _a === void 0 ? void 0 : _a.dragStart(e.detail);
  }
  /** Get keyboard down from element */
  onKeyUp(e) {
    this.beforeKeyUp.emit(e);
  }
  /** Get keyboard down from element */
  onKeyDown(e) {
    var _a;
    const proxy = this.beforeKeyDown.emit(e);
    if (e.defaultPrevented || proxy.defaultPrevented) {
      return;
    }
    (_a = this.keyboardService) === null || _a === void 0 ? void 0 : _a.keyDown(e, this.range);
  }
  // selection & keyboard
  selectionServiceSet(s) {
    this.selectionStoreService = new SelectionStoreService(s, {
      changeRange: range => this.triggerRangeEvent(range),
      focus: (focus, end) => this.doFocus(focus, end),
    });
    this.keyboardService = new KeyboardService({
      selectionStoreService: this.selectionStoreService,
      selectionStore: s,
      range: r => this.selectionStoreService.changeRange(r),
      focusNext: (f, next) => this.doFocus(f, f, next),
      applyEdit: val => {
        if (this.readonly) {
          return;
        }
        this.doEdit(val);
      },
      cancelEdit: async () => {
        await this.revogrEdit.cancel();
        this.closeEdit();
      },
      clearCell: () => !this.readonly && this.clearCell(),
      internalPaste: () => !this.readonly && this.internalPaste.emit(),
      getData: () => this.getData(),
      selectAll: () => this.selectAll.emit(),
    });
    this.createAutoFillService();
    this.createClipboardService();
  }
  // autofill
  createAutoFillService() {
    this.autoFillService = new AutoFillService({
      selectionStoreService: this.selectionStoreService,
      dimensionRow: this.dimensionRow,
      dimensionCol: this.dimensionCol,
      columnService: this.columnService,
      dataStore: this.dataStore,
      clearRangeDataApply: e => this.beforeRangeDataApply.emit(Object.assign(Object.assign({}, e), this.types)),
      setTempRange: e => this.setTempRange.emit(e),
      selectionChanged: e => this.internalSelectionChanged.emit(e),
      rangeCopy: e => this.beforeRangeCopyApply.emit(e),
      rangeDataApply: e => this.internalRangeDataApply.emit(e),
      setRange: e => this.triggerRangeEvent(e),
      getData: () => this.getData(),
    });
  }
  // columns
  columnServiceSet() {
    var _a;
    (_a = this.columnService) === null || _a === void 0 ? void 0 : _a.destroy();
    this.columnService = new ColumnService(this.dataStore, this.colData);
    this.createAutoFillService();
    this.createClipboardService();
  }
  // clipboard
  createClipboardService() {
    this.clipboardService = new ClipboardService({
      selectionStoreService: this.selectionStoreService,
      columnService: this.columnService,
      dataStore: this.dataStore,
      rangeApply: (d, r) => this.autoFillService.onRangeApply(d, r),
      rangeCopy: range => {
        if (!range) {
          return undefined;
        }
        const { data, mapping } = this.columnService.copyRangeArray(range, this.dataStore);
        const event = this.rangeClipboardCopy.emit(Object.assign({ range,
          data,
          mapping }, this.types));
        if (event.defaultPrevented) {
          return undefined;
        }
        return event.detail.data;
      },
      rangeClear: () => !this.readonly && this.clearCell(),
      beforeCopy: range => this.internalCopy.emit(range),
      beforePaste: (data, range) => {
        return this.rangeClipboardPaste.emit(Object.assign({ data,
          range }, this.types));
      },
    });
  }
  connectedCallback() {
    this.columnServiceSet();
    this.selectionServiceSet(this.selectionStore);
  }
  disconnectedCallback() {
    var _a;
    (_a = this.columnService) === null || _a === void 0 ? void 0 : _a.destroy();
  }
  renderRange(range) {
    const style = getElStyle(range, this.dimensionRow.state, this.dimensionCol.state);
    return [
      h("div", { class: SELECTION_BORDER_CLASS, style: style }, this.isMobileDevice && h("div", { class: "range-handlers" }, h("span", { class: MOBILE_CLASS }), h("span", { class: MOBILE_CLASS })))
    ];
  }
  renderEditCell() {
    // if can edit
    const editCell = this.selectionStore.get('edit');
    if (this.readonly || !editCell) {
      return null;
    }
    const val = editCell.val || this.columnService.getCellData(editCell.y, editCell.x);
    const editable = Object.assign(Object.assign({}, editCell), this.columnService.getSaveData(editCell.y, editCell.x, val));
    const renderEvent = this.beforeEditRender.emit(Object.assign({ range: Object.assign(Object.assign({}, editCell), { x1: editCell.x, y1: editCell.y }) }, this.types));
    if (renderEvent.defaultPrevented) {
      return null;
    }
    const { detail: { range }, } = renderEvent;
    const style = getElStyle(range, this.dimensionRow.state, this.dimensionCol.state);
    return (h("revogr-edit", { ref: el => {
        this.revogrEdit = el;
      }, onCellEdit: e => {
        const saveEv = this.beforeCellSave.emit(e.detail);
        if (!saveEv.defaultPrevented) {
          this.cellEdit(saveEv.detail);
        }
        // if not clear navigate to next cell after edit
        if (!saveEv.detail.preventFocus) {
          this.focusNext();
        }
      }, onCloseEdit: e => this.closeEdit(e), editCell: editable, saveOnClose: this.applyChangesOnClose, column: this.columnService.columns[editCell.x], editor: this.columnService.getCellEditor(editCell.y, editCell.x, this.editors), additionalData: this.additionalData, style: style }));
  }
  render() {
    const els = [];
    const editCell = this.renderEditCell();
    if (editCell) {
      els.push(editCell);
    }
    else {
      const range = this.selectionStoreService.ranged;
      const selectionFocus = this.selectionStoreService.focused;
      if ((range || selectionFocus) && this.useClipboard) {
        els.push(this.clipboardService.renderClipboard(this.readonly));
      }
      if (range) {
        els.push(...this.renderRange(range));
      }
      if (selectionFocus && !this.readonly && this.range) {
        els.push(this.autoFillService.renderAutofill(range, selectionFocus));
      }
      if (this.canDrag) {
        els.push(h("revogr-order-editor", { ref: e => (this.orderEditor = e), dataStore: this.dataStore, dimensionRow: this.dimensionRow, dimensionCol: this.dimensionCol, parent: this.element, onInternalRowDragStart: e => this.onRowDragStart(e) }));
      }
    }
    return (h(Host, { class: { mobile: this.isMobileDevice },
      // run edit on dblclick
      onDblClick: (e) => {
        // if dblclick prevented outside edit will not start
        if (!e.defaultPrevented) {
          this.doEdit();
        }
      }, onMouseDown: (e) => this.onElementMouseDown(e), onTouchStart: (e) => this.onElementMouseDown(e, true) }, els, h("slot", { name: "data" })));
  }
  doFocus(focus, end, next) {
    const { defaultPrevented } = this.beforeFocusCell.emit(this.columnService.getSaveData(focus.y, focus.x));
    if (defaultPrevented) {
      return false;
    }
    const evData = Object.assign({ range: Object.assign(Object.assign({}, focus), { x1: end.x, y1: end.y }), next }, this.types);
    const applyEvent = this.applyFocus.emit(evData);
    if (applyEvent.defaultPrevented) {
      return false;
    }
    const { range } = applyEvent.detail;
    return !this.focusCell.emit(Object.assign({ focus: {
        x: range.x,
        y: range.y,
      }, end: {
        x: range.x1,
        y: range.y1,
      } }, applyEvent.detail)).defaultPrevented;
  }
  triggerRangeEvent(range) {
    const type = this.types.rowType;
    const applyEvent = this.beforeApplyRange.emit(Object.assign({ range: Object.assign({}, range) }, this.types));
    if (applyEvent.defaultPrevented) {
      return false;
    }
    const data = this.columnService.getRangeTransformedToProps(applyEvent.detail.range, this.dataStore);
    let e = this.beforeSetRange.emit(data);
    e = this.setRange.emit(Object.assign(Object.assign({}, applyEvent.detail.range), { type }));
    if (e.defaultPrevented) {
      return false;
    }
    return !e.defaultPrevented;
  }
  onElementMouseDown(e, touch = false) {
    // Ignore focus if clicked input
    if (isEditInput(e.target)) {
      return;
    }
    const data = this.getData();
    if (e.defaultPrevented) {
      return;
    }
    const x = getFromEvent(e, 'clientX');
    const y = getFromEvent(e, 'clientY');
    // skip touch
    if (x === null || y === null) {
      return;
    }
    // Regular cell click
    const focusCell = getCurrentCell({ x, y }, data);
    this.selectionStoreService.focus(focusCell, this.range && e.shiftKey);
    // Initiate autofill selection
    if (this.range) {
      this.autoFillService.selectionStart(e.target, data);
      if (!touch) {
        e.preventDefault();
      }
      else if (verifyTouchTarget(e.touches[0], MOBILE_CLASS)) {
        e.preventDefault();
      }
    }
  }
  /**
   * Start cell editing
   */
  doEdit(val = '') {
    var _a;
    if (this.canEdit()) {
      const editCell = this.selectionStore.get('focus');
      const data = this.columnService.getSaveData(editCell.y, editCell.x);
      (_a = this.setEdit) === null || _a === void 0 ? void 0 : _a.emit(Object.assign(Object.assign({}, data), { val }));
    }
  }
  /**
   * Close editor event triggered
   * @param details - if requires focus next
   */
  closeEdit(e) {
    this.cancelEdit.emit();
    if (e === null || e === void 0 ? void 0 : e.detail) {
      this.focusNext();
    }
  }
  /** Edit finished, close cell and save */
  cellEdit(e) {
    const dataToSave = this.columnService.getSaveData(e.rgRow, e.rgCol, e.val);
    this.internalCellEdit.emit(dataToSave);
  }
  async focusNext() {
    const canFocus = await this.keyboardService.keyChangeSelection(new KeyboardEvent('keydown', {
      code: codesLetter.ARROW_DOWN,
    }), this.range);
    if (!canFocus) {
      this.closeEdit();
    }
  }
  clearCell() {
    if (this.selectionStoreService.ranged && !isRangeSingleCell(this.selectionStoreService.ranged)) {
      const data = this.columnService.getRangeStaticData(this.selectionStoreService.ranged, '');
      this.autoFillService.onRangeApply(data, this.selectionStoreService.ranged);
    }
    else if (this.canEdit()) {
      const focused = this.selectionStoreService.focused;
      const cell = this.columnService.getSaveData(focused.y, focused.x);
      this.cellEdit({
        rgRow: focused.y,
        rgCol: focused.x,
        val: '',
        type: cell.type,
        prop: cell.prop,
      });
    }
  }
  onRowDragStart({ detail }) {
    detail.text = this.columnService.getCellData(detail.cell.y, detail.cell.x);
  }
  /** Check if edit possible */
  canEdit() {
    var _a;
    if (this.readonly) {
      return false;
    }
    const editCell = this.selectionStoreService.focused;
    return editCell && !((_a = this.columnService) === null || _a === void 0 ? void 0 : _a.isReadOnly(editCell.y, editCell.x));
  }
  get types() {
    return {
      rowType: this.dataStore.get('type'),
      colType: this.columnService.type,
    };
  }
  /** Collect data from element */
  getData() {
    return {
      el: this.element,
      rows: this.dimensionRow.state,
      cols: this.dimensionCol.state,
      lastCell: this.lastCell,
    };
  }
  static get is() { return "revogr-overlay-selection"; }
  static get originalStyleUrls() {
    return {
      "$": ["revogr-overlay-style.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["revogr-overlay-style.css"]
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
      "canDrag": {
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
          "text": "Enable revogr-order-editor component (read more in revogr-order-editor component)\nAllows D&D"
        },
        "attribute": "can-drag",
        "reflect": false
      },
      "useClipboard": {
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
          "text": "Enable revogr-clipboard component (read more in revogr-clipboard component)\nAllows copy/paste"
        },
        "attribute": "use-clipboard",
        "reflect": false
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
      "dataStore": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>",
          "resolved": "ObservableMap<DataSourceState<DataType, DimensionRows>>",
          "references": {
            "Observable": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Observable"
            },
            "DataSourceState": {
              "location": "import",
              "path": "../../store/dataSource/data.store",
              "id": "src/store/dataSource/data.store.ts::DataSourceState"
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
          "text": "Row data store"
        }
      },
      "colData": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Observable<DataSourceState<RevoGrid.ColumnRegular, RevoGrid.DimensionCols>>",
          "resolved": "ObservableMap<DataSourceState<ColumnRegular, DimensionCols>>",
          "references": {
            "Observable": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Observable"
            },
            "DataSourceState": {
              "location": "import",
              "path": "../../store/dataSource/data.store",
              "id": "src/store/dataSource/data.store.ts::DataSourceState"
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
          "text": "Column data store"
        }
      },
      "lastCell": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Selection.Cell",
          "resolved": "Cell",
          "references": {
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
          "text": "Last cell position"
        }
      },
      "editors": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Edition.Editors",
          "resolved": "{ [name: string]: EditorCtr; }",
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
      "applyChangesOnClose": {
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
          "text": "If true applys changes when cell closes if not Escape"
        },
        "attribute": "apply-changes-on-close",
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
      },
      "isMobileDevice": {
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
          "text": "Is mobile view mode"
        },
        "attribute": "is-mobile-device",
        "reflect": false
      }
    };
  }
  static get events() {
    return [{
        "method": "internalCopy",
        "name": "internalCopy",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before clipboard copy happened"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "internalPaste",
        "name": "internalPaste",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before paste happened"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "internalCellEdit",
        "name": "internalCellEdit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "Edition.BeforeSaveDataDetails",
          "resolved": "{ prop: ColumnProp; model: DataType; val?: string; rowIndex: number; colIndex: number; colType: DimensionCols; type: DimensionRows; }",
          "references": {
            "Edition": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Edition"
            }
          }
        }
      }, {
        "method": "beforeFocusCell",
        "name": "beforeFocusCell",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "Edition.BeforeSaveDataDetails",
          "resolved": "{ prop: ColumnProp; model: DataType; val?: string; rowIndex: number; colIndex: number; colType: DimensionCols; type: DimensionRows; }",
          "references": {
            "Edition": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Edition"
            }
          }
        }
      }, {
        "method": "setEdit",
        "name": "setEdit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Set edit cell"
        },
        "complexType": {
          "original": "Edition.BeforeEdit",
          "resolved": "{ prop: ColumnProp; model: DataType; val?: string; rowIndex: number; colIndex: number; colType: DimensionCols; type: DimensionRows; }",
          "references": {
            "Edition": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Edition"
            }
          }
        }
      }, {
        "method": "beforeApplyRange",
        "name": "before-apply-range",
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
        "method": "beforeSetRange",
        "name": "before-set-range",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before range selection applied"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "beforeEditRender",
        "name": "before-edit-render",
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
        "method": "setRange",
        "name": "setRange",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "Selection.RangeArea & { type: RevoGrid.MultiDimensionType }",
          "resolved": "RangeArea & { type: MultiDimensionType; }",
          "references": {
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "selectAll",
        "name": "selectall",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "cancelEdit",
        "name": "cancelEdit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Used for editors support when close requested"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "setTempRange",
        "name": "setTempRange",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "Selection.TempRange | null",
          "resolved": "{ type: string; area: RangeArea; }",
          "references": {
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            }
          }
        }
      }, {
        "method": "applyFocus",
        "name": "applyFocus",
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
        "method": "focusCell",
        "name": "focusCell",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "ApplyFocusEvent",
          "resolved": "AllDimensionType & FocusedCells",
          "references": {
            "ApplyFocusEvent": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::ApplyFocusEvent"
            }
          }
        }
      }, {
        "method": "beforeRangeDataApply",
        "name": "beforeRangeDataApply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Range data apply"
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
        "method": "internalSelectionChanged",
        "name": "internalSelectionChanged",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Selection range changed"
        },
        "complexType": {
          "original": "Selection.ChangedRange",
          "resolved": "{ type: DimensionRows; colType: DimensionCols; newRange: RangeArea; oldRange: RangeArea; mapping: OldNewRangeMapping; newData: { [key: number]: DataType; }; }",
          "references": {
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            }
          }
        }
      }, {
        "method": "beforeRangeCopyApply",
        "name": "beforeRangeCopyApply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Selection range changed"
        },
        "complexType": {
          "original": "Selection.ChangedRange",
          "resolved": "{ type: DimensionRows; colType: DimensionCols; newRange: RangeArea; oldRange: RangeArea; mapping: OldNewRangeMapping; newData: { [key: number]: DataType; }; }",
          "references": {
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            }
          }
        }
      }, {
        "method": "internalRangeDataApply",
        "name": "internalRangeDataApply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Range data apply"
        },
        "complexType": {
          "original": "Edition.BeforeRangeSaveDataDetails",
          "resolved": "{ data: DataLookup; models: { [rowIndex: number]: DataType; }; type: DimensionRows; }",
          "references": {
            "Edition": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Edition"
            }
          }
        }
      }, {
        "method": "rangeClipboardCopy",
        "name": "rangeClipboardCopy",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Range copy"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "rangeClipboardPaste",
        "name": "rangeClipboardPaste",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": ""
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "beforeKeyDown",
        "name": "beforekeydown",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before key up event proxy, used to prevent key up trigger.\nIf you have some custom behaviour event, use this event to check if it wasn't processed by internal logic.\nCall preventDefault()"
        },
        "complexType": {
          "original": "KeyboardEvent",
          "resolved": "KeyboardEvent",
          "references": {
            "KeyboardEvent": {
              "location": "global",
              "id": "global::KeyboardEvent"
            }
          }
        }
      }, {
        "method": "beforeKeyUp",
        "name": "beforekeyup",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before key down event proxy, used to prevent key down trigger.\nIf you have some custom behaviour event, use this event to check if it wasn't processed by internal logic.\nCall preventDefault()"
        },
        "complexType": {
          "original": "KeyboardEvent",
          "resolved": "KeyboardEvent",
          "references": {
            "KeyboardEvent": {
              "location": "global",
              "id": "global::KeyboardEvent"
            }
          }
        }
      }, {
        "method": "beforeCellSave",
        "name": "before-cell-save",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Runs before cell save\nCan be used to override or cancel original save"
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
        "propName": "selectionStore",
        "methodName": "selectionServiceSet"
      }, {
        "propName": "dimensionRow",
        "methodName": "createAutoFillService"
      }, {
        "propName": "dimensionCol",
        "methodName": "createAutoFillService"
      }, {
        "propName": "dataStore",
        "methodName": "columnServiceSet"
      }, {
        "propName": "colData",
        "methodName": "columnServiceSet"
      }];
  }
  static get listeners() {
    return [{
        "name": "touchmove",
        "method": "onMouseMove",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "mousemove",
        "method": "onMouseMove",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "touchend",
        "method": "onMouseUp",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "mouseup",
        "method": "onMouseUp",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "mouseleave",
        "method": "onMouseUp",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "dragStartCell",
        "method": "onCellDrag",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "keyup",
        "method": "onKeyUp",
        "target": "document",
        "capture": false,
        "passive": false
      }, {
        "name": "keydown",
        "method": "onKeyDown",
        "target": "document",
        "capture": false,
        "passive": false
      }];
  }
}
//# sourceMappingURL=revogr-overlay-selection.js.map
