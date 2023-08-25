/*!
 * Built by Revolist
 */
import { h, Host } from "@stencil/core";
import each from "lodash/each";
import ColumnDataProvider from "../../services/column.data.provider";
import { DataProvider } from "../../services/data.provider";
import { getVisibleSourceItem } from "../../store/dataSource/data.store";
import DimensionProvider from "../../services/dimension.provider";
import ViewportProvider from "../../services/viewport.provider";
import ThemeService from "../../themeManager/themeService";
import { timeout } from "../../utils";
import AutoSize from "../../plugins/autoSizeColumn";
import { columnTypes as columnDimensions, rowTypes as rowDimensions } from "../../store/storeTypes";
import FilterPlugin from "../../plugins/filter/filter.plugin";
import SortingPlugin from "../../plugins/sorting/sorting.plugin";
import ExportFilePlugin from "../../plugins/export/export.plugin";
import GroupingRowPlugin from "../../plugins/groupingRow/grouping.row.plugin";
import { RevoViewPort } from "./viewport";
import ViewportService from "./viewport.service";
import { ViewPortSections } from "./viewport.section";
import GridScrollingService from "./viewport.scrolling.service";
import { UUID } from "../../utils/consts";
import SelectionStoreConnector from "../../services/selection.store.connector";
import StretchColumn, { isStretchPlugin } from "../../plugins/stretchPlugin";
import { rowDefinitionByType, rowDefinitionRemoveByType } from "./grid.helpers";
import ColumnPlugin from "../../plugins/moveColumn/columnDragPlugin";
import { getFromEvent } from "../../utils/events";
/**
 * Slots
 * @slot data-{column-type}-{row-type}. @example data-rgCol-rgRow - main data slot
 * @slot focus-${view.type}-${data.type}. @example focus-rgCol-rgRow - focus layer for main data
 */
export class RevoGridComponent {
  constructor() {
    // --------------------------------------------------------------------------
    //
    //  Listeners outside scope
    //
    // --------------------------------------------------------------------------
    this.clickTrackForFocusClear = null;
    this.uuid = null;
    this.viewport = null;
    /**
     * Plugins
     * Define plugins collection
     */
    this.internalPlugins = [];
    this.rowHeaders = undefined;
    this.frameSize = 1;
    this.rowSize = 0;
    this.colSize = 100;
    this.range = false;
    this.readonly = false;
    this.resize = false;
    this.canFocus = true;
    this.useClipboard = true;
    this.columns = [];
    this.source = [];
    this.pinnedTopSource = [];
    this.pinnedBottomSource = [];
    this.rowDefinitions = [];
    this.editors = {};
    this.applyOnClose = false;
    this.plugins = undefined;
    this.columnTypes = {};
    this.theme = 'default';
    this.rowClass = '';
    this.autoSizeColumn = false;
    this.filter = false;
    this.focusTemplate = undefined;
    this.canMoveColumns = false;
    this.trimmedRows = {};
    this.exporting = false;
    this.grouping = undefined;
    this.stretch = true;
    this.additionalData = {};
    this.extraElements = [];
  }
  // --------------------------------------------------------------------------
  //
  //  Methods
  //
  // --------------------------------------------------------------------------
  /**
   * Refreshes data viewport.
   * Can be specific part as rgRow or pinned rgRow or 'all' by default.
   */
  async refresh(type = 'all') {
    this.dataProvider.refresh(type);
  }
  /**  Scrolls view port to specified rgRow index */
  async scrollToRow(coordinate = 0) {
    const y = this.dimensionProvider.getViewPortPos({
      coordinate,
      dimension: 'rgRow',
    });
    await this.scrollToCoordinate({ y });
  }
  /** Scrolls view port to specified column index */
  async scrollToColumnIndex(coordinate = 0) {
    const x = this.dimensionProvider.getViewPortPos({
      coordinate,
      dimension: 'rgCol',
    });
    await this.scrollToCoordinate({ x });
  }
  /**  Scrolls view port to specified column prop */
  async scrollToColumnProp(prop) {
    const coordinate = this.columnProvider.getColumnIndexByProp(prop, 'rgCol');
    if (coordinate < 0) {
      // already on the screen
      return;
    }
    const x = this.dimensionProvider.getViewPortPos({
      coordinate,
      dimension: 'rgCol',
    });
    await this.scrollToCoordinate({ x });
  }
  /** Update columns */
  async updateColumns(cols) {
    this.columnProvider.updateColumns(cols);
  }
  /** Add trimmed by type */
  async addTrimmed(trimmed, trimmedType = 'external', type = 'rgRow') {
    const event = this.beforetrimmed.emit({
      trimmed,
      trimmedType,
      type,
    });
    if (event.defaultPrevented) {
      return event;
    }
    this.dataProvider.setTrimmed({ [trimmedType]: event.detail.trimmed }, type);
    this.aftertrimmed.emit();
    return event;
  }
  /**  Scrolls view port to coordinate */
  async scrollToCoordinate(cell) {
    var _a;
    (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.scrollToCell(cell);
  }
  /**  Bring cell to edit mode */
  async setCellEdit(rgRow, prop, rowSource = 'rgRow') {
    var _a;
    const rgCol = ColumnDataProvider.getColumnByProp(this.columns, prop);
    if (!rgCol) {
      return;
    }
    await timeout();
    const colGroup = rgCol.pin || 'rgCol';
    (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.setEdit(rgRow, this.columnProvider.getColumnIndexByProp(prop, colGroup), colGroup, rowSource);
  }
  /**  Set focus range */
  async setCellsFocus(cellStart = { x: 0, y: 0 }, cellEnd = { x: 0, y: 0 }, colType = 'rgCol', rowType = 'rgRow') {
    var _a;
    (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.setFocus(colType, rowType, cellStart, cellEnd);
  }
  /**
   * Register new virtual node inside of grid
   * Used for additional items creation such as plugin elements
   */
  async registerVNode(elements) {
    this.extraElements.push(...elements);
    this.extraElements = [...this.extraElements];
  }
  /**  Get data from source */
  async getSource(type = 'rgRow') {
    return this.dataProvider.stores[type].store.get('source');
  }
  /**
   * Get data from visible part of source
   * Trimmed/filtered rows will be excluded
   * @param type - type of source
   */
  async getVisibleSource(type = 'rgRow') {
    return getVisibleSourceItem(this.dataProvider.stores[type].store);
  }
  /**
   * Provides access to rows internal store observer
   * Can be used for plugin support
   * @param type - type of source
   */
  async getSourceStore(type = 'rgRow') {
    return this.dataProvider.stores[type].store;
  }
  /**
   * Provides access to column internal store observer
   * Can be used for plugin support
   * @param type - type of column
   */
  async getColumnStore(type = 'rgCol') {
    return this.columnProvider.stores[type].store;
  }
  /**
   * Update column sorting
   * @param column - full column details to update
   * @param index - virtual column index
   * @param order - order to apply
   */
  async updateColumnSorting(column, index, order, additive) {
    return this.columnProvider.updateColumnSorting(column, index, order, additive);
  }
  /**
   * Clears column sorting
   */
  async clearSorting() {
    this.columnProvider.clearSorting();
  }
  /**
   * Receive all columns in data source
   */
  async getColumns() {
    return this.columnProvider.getColumns();
  }
  /**
   * Clear current grid focus
   */
  async clearFocus() {
    var _a;
    const focused = (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.getFocused();
    const event = this.beforefocuslost.emit(focused);
    if (event.defaultPrevented) {
      return;
    }
    this.selectionStoreConnector.clearAll();
  }
  /**
   * Get all active plugins instances
   */
  async getPlugins() {
    return [...this.internalPlugins];
  }
  /**
   * Get the currently focused cell.
   */
  async getFocused() {
    var _a;
    return (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.getFocused();
  }
  /**
   * Get size of content
   * Including all pinned data
   */
  async getContentSize() {
    var _a;
    return (_a = this.dimensionProvider) === null || _a === void 0 ? void 0 : _a.getFullSize();
  }
  /**
   * Get the currently selected Range.
   */
  async getSelectedRange() {
    var _a;
    return (_a = this.viewport) === null || _a === void 0 ? void 0 : _a.getSelectedRange();
  }
  mousedownHandle(event) {
    const screenX = getFromEvent(event, 'screenX');
    const screenY = getFromEvent(event, 'screenY');
    if (screenX === null || screenY === null) {
      return;
    }
    this.clickTrackForFocusClear = screenX + screenY;
  }
  mouseupHandle(event) {
    const screenX = getFromEvent(event, 'screenX');
    const screenY = getFromEvent(event, 'screenY');
    if (screenX === null || screenY === null) {
      return;
    }
    if (event.defaultPrevented) {
      return;
    }
    const target = event.target;
    const pos = screenX + screenY;
    // detect if mousemove then do nothing
    if (Math.abs(this.clickTrackForFocusClear - pos) > 10) {
      return;
    }
    // check if action finished inside of the document
    // clear data which is outside of grid
    // if event prevented or it is current table don't clear focus
    if (target === null || target === void 0 ? void 0 : target.closest(`[${UUID}="${this.uuid}"]`)) {
      return;
    }
    this.clearFocus();
  }
  // --------------------------------------------------------------------------
  //
  //  Listeners
  //
  // --------------------------------------------------------------------------
  /** DRAG AND DROP */
  onRowDragStarted(e) {
    var _a;
    // e.cancelBubble = true;
    const dragStart = this.rowdragstart.emit(e.detail);
    if (dragStart.defaultPrevented) {
      e.preventDefault();
      return;
    }
    (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.start(this.element, Object.assign(Object.assign({}, e.detail), dragStart.detail));
  }
  onRowDragEnd() {
    var _a;
    (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.end();
  }
  onRowDrag({ detail }) {
    var _a;
    (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.move(detail);
  }
  onRowMouseMove(e) {
    var _a;
    // e.cancelBubble = true;
    (_a = this.orderService) === null || _a === void 0 ? void 0 : _a.moveTip(e.detail);
  }
  async onBeforeEdit(e) {
    // e.cancelBubble = true;
    const { defaultPrevented, detail } = this.beforeedit.emit(e.detail);
    await timeout();
    // apply data
    if (!defaultPrevented) {
      this.dataProvider.setCellData(detail);
      this.afteredit.emit(detail);
    }
  }
  onBeforeRangeEdit(e) {
    // e.cancelBubble = true;
    const { defaultPrevented, detail } = this.beforerangeedit.emit(e.detail);
    if (defaultPrevented) {
      e.preventDefault();
      return;
    }
    this.afteredit.emit(detail);
  }
  onRangeChanged(e) {
    // e.cancelBubble = true;
    const beforeange = this.beforeange.emit(e.detail);
    if (beforeange.defaultPrevented) {
      e.preventDefault();
    }
    const beforeFill = this.beforeautofill.emit(beforeange.detail);
    if (beforeFill.defaultPrevented) {
      e.preventDefault();
    }
  }
  onRowDropped(e) {
    // e.cancelBubble = true;
    const { defaultPrevented } = this.roworderchanged.emit(e.detail);
    if (defaultPrevented) {
      e.preventDefault();
    }
  }
  onHeaderClick(e) {
    const { defaultPrevented } = this.headerclick.emit(Object.assign(Object.assign({}, e.detail.column), { originalEvent: e.detail.originalEvent }));
    if (defaultPrevented) {
      e.preventDefault();
    }
  }
  onCellFocus(e) {
    // e.cancelBubble = true;
    const { defaultPrevented } = this.beforecellfocus.emit(e.detail);
    if (!this.canFocus || defaultPrevented) {
      e.preventDefault();
    }
  }
  /**
   * Column format change will trigger column structure update
   */
  columnTypesChanged() {
    this.columnChanged(this.columns);
  }
  columnChanged(newVal = []) {
    // clear existing data
    this.dimensionProvider.dropColumns();
    const columnGather = ColumnDataProvider.getColumns(newVal, 0, this.columnTypes);
    this.beforecolumnsset.emit(columnGather);
    for (let type of columnDimensions) {
      const items = columnGather.columns[type];
      this.dimensionProvider.setNewColumns(type, items.length, ColumnDataProvider.getSizes(items), type !== 'rgCol');
    }
    this.beforecolumnapplied.emit(columnGather);
    const columns = this.columnProvider.setColumns(columnGather);
    this.aftercolumnsset.emit({
      columns,
      order: this.columnProvider.order,
    });
  }
  rowSizeChanged(s) {
    this.dimensionProvider.setSettings({ originItemSize: s }, 'rgRow');
    rowDimensions.forEach((t) => {
      this.dimensionProvider.clearSize(t, this.dataProvider.stores[t].store.get('source').length);
      this.dimensionProvider.setCustomSizes(t, {}, true);
    });
  }
  themeChanged(t) {
    this.themeService.register(t);
    this.dimensionProvider.setSettings({ originItemSize: this.themeService.rowSize }, 'rgRow');
    this.dimensionProvider.setSettings({ originItemSize: this.colSize }, 'rgCol');
  }
  dataSourceChanged(newVal = [], _, watchName) {
    let type = 'rgRow';
    switch (watchName) {
      case 'pinnedBottomSource':
        type = 'rowPinEnd';
        break;
      case 'pinnedTopSource':
        type = 'rowPinStart';
        break;
      case 'source':
        type = 'rgRow';
        /** applied for source only for cross compatability between plugins */
        const beforesourceset = this.beforesourceset.emit({
          type,
          source: newVal,
        });
        newVal = beforesourceset.detail.source;
        break;
    }
    const beforesourceset = this.beforeAnySource.emit({
      type,
      source: newVal,
    });
    const newSource = [...beforesourceset.detail.source];
    this.dataProvider.setData(newSource, type);
    /** applied for source only for cross compatability between plugins */
    if (watchName === 'source') {
      this.aftersourceset.emit({
        type,
        source: newVal,
      });
    }
    this.afterAnySource.emit({
      type,
      source: newVal,
    });
  }
  rowDefChanged(after, before) {
    const { detail: { vals: newVal, oldVals: oldVal } } = this.beforerowdefinition.emit({
      vals: after,
      oldVals: before
    });
    // apply new vals
    const newRows = rowDefinitionByType(newVal);
    // clear current defs
    if (oldVal) {
      const remove = rowDefinitionRemoveByType(oldVal);
      // clear all old data and drop sizes
      each(remove, (_, t) => {
        this.dimensionProvider.clearSize(t, this.dataProvider.stores[t].store.get('source').length);
      });
    }
    if (!newVal.length) {
      return;
    }
    each(newRows, (r, k) => this.dimensionProvider.setCustomSizes(k, r.sizes || {}));
  }
  trimmedRowsChanged(newVal = {}) {
    this.addTrimmed(newVal);
  }
  /**
   * Grouping
   */
  groupingChanged(newVal = {}) {
    let grPlugin;
    for (let p of this.internalPlugins) {
      const isGrouping = p;
      if (isGrouping.setGrouping) {
        grPlugin = isGrouping;
        break;
      }
    }
    if (!grPlugin) {
      return;
    }
    grPlugin.setGrouping(newVal || {});
  }
  /**
   * Stretch Plugin Apply
   */
  applyStretch(isStretch) {
    if (isStretch === 'false') {
      isStretch = false;
    }
    let stretch = this.internalPlugins.filter(p => isStretchPlugin(p))[0];
    if ((typeof isStretch === 'boolean' && isStretch) || isStretch === 'true') {
      if (!stretch) {
        this.internalPlugins.push(new StretchColumn(this.element, {
          dataProvider: this.dataProvider,
          columnProvider: this.columnProvider,
          dimensionProvider: this.dimensionProvider,
        }));
      }
      else if (isStretchPlugin(stretch)) {
        stretch.applyStretch(this.columnProvider.getRawColumns());
      }
    }
    else if (stretch) {
      const index = this.internalPlugins.indexOf(stretch);
      this.internalPlugins.splice(index, 1);
    }
  }
  applyFilter(cfg) {
    this.filterconfigchanged.emit(cfg);
  }
  rowHeadersChange(rowHeaders) {
    this.rowheaderschanged.emit(rowHeaders);
  }
  connectedCallback() {
    this.viewportProvider = new ViewportProvider();
    this.themeService = new ThemeService({
      rowSize: this.rowSize,
    });
    const dimensionProviderConfig = {
      realSizeChanged: (k) => this.contentsizechanged.emit(k),
    };
    this.dimensionProvider = new DimensionProvider(this.viewportProvider, dimensionProviderConfig);
    this.columnProvider = new ColumnDataProvider();
    this.selectionStoreConnector = new SelectionStoreConnector();
    this.dataProvider = new DataProvider(this.dimensionProvider);
    this.uuid = `${new Date().getTime()}-rvgrid`;
    const pluginData = {
      data: this.dataProvider,
      column: this.columnProvider,
      dimension: this.dimensionProvider,
      viewport: this.viewportProvider,
      selection: this.selectionStoreConnector,
    };
    if (this.autoSizeColumn) {
      this.internalPlugins.push(new AutoSize(this.element, {
        dataProvider: this.dataProvider,
        columnProvider: this.columnProvider,
        dimensionProvider: this.dimensionProvider,
      }, typeof this.autoSizeColumn === 'object' ? this.autoSizeColumn : undefined));
    }
    if (this.filter) {
      this.internalPlugins.push(new FilterPlugin(this.element, this.uuid, typeof this.filter === 'object' ? this.filter : undefined));
    }
    if (this.exporting) {
      this.internalPlugins.push(new ExportFilePlugin(this.element));
    }
    this.internalPlugins.push(new SortingPlugin(this.element));
    this.internalPlugins.push(new GroupingRowPlugin(this.element, {
      dataProvider: this.dataProvider,
      columnProvider: this.columnProvider,
    }));
    if (this.canMoveColumns) {
      this.internalPlugins.push(new ColumnPlugin(this.element, pluginData));
    }
    if (this.plugins) {
      this.plugins.forEach(p => {
        this.internalPlugins.push(new p(this.element, pluginData));
      });
    }
    this.applyStretch(this.stretch);
    this.themeChanged(this.theme);
    this.columnChanged(this.columns);
    this.dataSourceChanged(this.source, undefined, 'source');
    this.dataSourceChanged(this.pinnedTopSource, undefined, 'pinnedTopSource');
    this.dataSourceChanged(this.pinnedBottomSource, undefined, 'pinnedBottomSource');
    this.trimmedRowsChanged(this.trimmedRows);
    this.rowDefChanged(this.rowDefinitions);
    this.groupingChanged(this.grouping);
    this.scrollingService = new GridScrollingService((e) => {
      this.dimensionProvider.setViewPortCoordinate({
        coordinate: e.coordinate,
        type: e.dimension,
      });
      this.viewportscroll.emit(e);
    });
  }
  disconnectedCallback() {
    // destroy plugins on element disconnect
    each(this.internalPlugins, p => p.destroy());
    this.internalPlugins = [];
  }
  render() {
    const contentHeight = this.dimensionProvider.stores['rgRow'].store.get('realSize');
    this.viewport = new ViewportService({
      columnProvider: this.columnProvider,
      dataProvider: this.dataProvider,
      dimensionProvider: this.dimensionProvider,
      viewportProvider: this.viewportProvider,
      uuid: this.uuid,
      scrollingService: this.scrollingService,
      orderService: this.orderService,
      selectionStoreConnector: this.selectionStoreConnector,
      resize: c => this.aftercolumnresize.emit(c),
    }, contentHeight);
    const views = [];
    if (this.rowHeaders && this.viewport.columns.length) {
      const anyView = this.viewport.columns[0];
      views.push(h("revogr-row-headers", { additionalData: this.additionalData, height: contentHeight, rowClass: this.rowClass, resize: this.resize, dataPorts: anyView.dataPorts, headerProp: anyView.headerProp, uiid: anyView.prop[UUID], rowHeaderColumn: typeof this.rowHeaders === 'object' ? this.rowHeaders : undefined, onScrollViewport: ({ detail: e }) => this.scrollingService.scrollService(e, 'headerRow'), onElementToScroll: ({ detail: e }) => this.scrollingService.registerElement(e, 'headerRow') }));
    }
    views.push(h(ViewPortSections, { additionalData: this.additionalData, columnFilter: !!this.filter, resize: this.resize, readonly: this.readonly, range: this.range, rowClass: this.rowClass, editors: this.editors, applyEditorChangesOnClose: this.applyOnClose, useClipboard: this.useClipboard, columns: this.viewport.columns, onSelectAll: () => {
        this.selectionStoreConnector.selectAll();
      }, onEdit: detail => {
        const event = this.beforeeditstart.emit(detail);
        if (!event.defaultPrevented) {
          this.selectionStoreConnector.setEdit(detail.val);
        }
      }, onCancelEdit: () => {
        this.selectionStoreConnector.setEdit(false);
      }, registerElement: (e, k) => this.scrollingService.registerElement(e, k), scrollSection: (details, k) => this.scrollingService.scrollService(details, k), scrollSectionSilent: (details, k) => this.scrollingService.scrollSilentService(details, k), focusTemplate: this.focusTemplate }));
    return (h(Host, Object.assign({}, { [`${UUID}`]: this.uuid }), h(RevoViewPort, { viewports: this.viewportProvider.stores, dimensions: this.dimensionProvider.stores, orderRef: e => (this.orderService = e), registerElement: (e, k) => this.scrollingService.registerElement(e, k), nakedClick: () => this.viewport.clearEdit(), onScroll: details => this.scrollingService.scrollService(details) }, h("slot", { name: 'viewport' }), views), this.extraElements));
  }
  static get is() { return "revo-grid"; }
  static get originalStyleUrls() {
    return {
      "$": ["revo-grid-style.scss"]
    };
  }
  static get styleUrls() {
    return {
      "$": ["revo-grid-style.css"]
    };
  }
  static get properties() {
    return {
      "rowHeaders": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.RowHeaders | boolean",
          "resolved": "RowHeaders | boolean",
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
          "text": "Excel like show rgRow indexe per rgRow"
        },
        "attribute": "row-headers",
        "reflect": false
      },
      "frameSize": {
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
          "text": "Defines how many rows/columns should be rendered outside visible area."
        },
        "attribute": "frame-size",
        "reflect": false,
        "defaultValue": "1"
      },
      "rowSize": {
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
          "text": "Indicates default rgRow size.\nBy default 0, means theme package size will be applied"
        },
        "attribute": "row-size",
        "reflect": false,
        "defaultValue": "0"
      },
      "colSize": {
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
          "text": "Indicates default column size."
        },
        "attribute": "col-size",
        "reflect": false,
        "defaultValue": "100"
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
          "text": "When true, user can range selection."
        },
        "attribute": "range",
        "reflect": false,
        "defaultValue": "false"
      },
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
          "text": "When true, grid in read only mode."
        },
        "attribute": "readonly",
        "reflect": false,
        "defaultValue": "false"
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
          "text": "When true, columns are resizable."
        },
        "attribute": "resize",
        "reflect": false,
        "defaultValue": "false"
      },
      "canFocus": {
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
          "text": "When true cell focus appear."
        },
        "attribute": "can-focus",
        "reflect": false,
        "defaultValue": "true"
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
          "text": "When true enable clipboard."
        },
        "attribute": "use-clipboard",
        "reflect": false,
        "defaultValue": "true"
      },
      "columns": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "(RevoGrid.ColumnRegular | RevoGrid.ColumnGrouping)[]",
          "resolved": "(ColumnRegular | ColumnGrouping)[]",
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
          "text": "Columns - defines an array of grid columns.\nCan be column or grouped column."
        },
        "defaultValue": "[]"
      },
      "source": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.DataType[]",
          "resolved": "DataType[]",
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
          "text": "Source - defines main data source.\nCan be an Object or 2 dimensional array([][]);\nKeys/indexes referenced from columns Prop"
        },
        "defaultValue": "[]"
      },
      "pinnedTopSource": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.DataType[]",
          "resolved": "DataType[]",
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
          "text": "Pinned top Source: {[T in ColumnProp]: any} - defines pinned top rows data source."
        },
        "defaultValue": "[]"
      },
      "pinnedBottomSource": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.DataType[]",
          "resolved": "DataType[]",
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
          "text": "Pinned bottom Source: {[T in ColumnProp]: any} - defines pinned bottom rows data source."
        },
        "defaultValue": "[]"
      },
      "rowDefinitions": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.RowDefinition[]",
          "resolved": "RowDefinition[]",
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
          "text": "Row properies applied"
        },
        "defaultValue": "[]"
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
        },
        "defaultValue": "{}"
      },
      "applyOnClose": {
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
          "text": "Apply changes typed in editor on editor close except Escape cases\nIf custom editor in use @method getValue required\nCheck interfaces.d.ts @EditorBase for more info"
        },
        "attribute": "apply-on-close",
        "reflect": false,
        "defaultValue": "false"
      },
      "plugins": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoPlugin.PluginClass[]",
          "resolved": "(typeof Plugin)[]",
          "references": {
            "RevoPlugin": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoPlugin"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Custom grid plugins\nHas to be predefined during first grid init\nEvery plugin should be inherited from BasePlugin"
        }
      },
      "columnTypes": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "{ [name: string]: RevoGrid.ColumnType }",
          "resolved": "{ [name: string]: ColumnType; }",
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
          "text": "Column Types Format\nEvery type represent multiple column properties\nTypes will be merged but can be replaced with column properties\nTypes were made as separate objects to be reusable per multiple columns"
        },
        "defaultValue": "{}"
      },
      "theme": {
        "type": "string",
        "mutable": true,
        "complexType": {
          "original": "ThemeSpace.Theme",
          "resolved": "\"compact\" | \"darkCompact\" | \"darkMaterial\" | \"default\" | \"material\"",
          "references": {
            "ThemeSpace": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::ThemeSpace"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Theme name"
        },
        "attribute": "theme",
        "reflect": true,
        "defaultValue": "'default'"
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
          "text": "Row class property\nDefine this property in rgRow object and this will be mapped as rgRow class"
        },
        "attribute": "row-class",
        "reflect": true,
        "defaultValue": "''"
      },
      "autoSizeColumn": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean | AutoSizeColumnConfig",
          "resolved": "boolean | { mode?: ColumnAutoSizeMode; allColumns?: boolean; letterBlockSize?: number; preciseSize?: boolean; }",
          "references": {
            "AutoSizeColumnConfig": {
              "location": "import",
              "path": "../../plugins/autoSizeColumn",
              "id": "src/plugins/autoSizeColumn.ts::AutoSizeColumnConfig"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Autosize config\nEnable columns autoSize, for more details check @autoSizeColumn plugin\nBy default disabled, hence operation is not resource efficient\ntrue to enable with default params (double header separator click for autosize)\nor provide config"
        },
        "attribute": "auto-size-column",
        "reflect": false,
        "defaultValue": "false"
      },
      "filter": {
        "type": "boolean",
        "mutable": false,
        "complexType": {
          "original": "boolean | ColumnFilterConfig",
          "resolved": "boolean | { collection?: FilterCollection; include?: string[]; customFilters?: Record<string, CustomFilter>; filterProp?: string; localization?: FilterLocalization; multiFilterItems?: MultiFilterItem; disableDynamicFiltering?: boolean; }",
          "references": {
            "ColumnFilterConfig": {
              "location": "import",
              "path": "../../plugins/filter/filter.plugin",
              "id": "src/plugins/filter/filter.plugin.tsx::ColumnFilterConfig"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Enables filter plugin\nCan be boolean\nCan be filter collection"
        },
        "attribute": "filter",
        "reflect": false,
        "defaultValue": "false"
      },
      "focusTemplate": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "RevoGrid.FocusTemplateFunc",
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
          "text": "Apply changes typed in editor on editor close except Escape cases\nIf custom editor in use @method getValue required\nCheck interfaces.d.ts @EditorBase for more info"
        }
      },
      "canMoveColumns": {
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
          "text": "Enables column move plugin\nCan be boolean"
        },
        "attribute": "can-move-columns",
        "reflect": false,
        "defaultValue": "false"
      },
      "trimmedRows": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "Record<number, boolean>",
          "resolved": "{ [x: number]: boolean; }",
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
          "tags": [{
              "name": "trimmedRows",
              "text": "are physical rgRow indexes to hide"
            }],
          "text": "Trimmed rows\nFunctionality which allows to hide rows from main data set"
        },
        "defaultValue": "{}"
      },
      "exporting": {
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
          "text": "Enables export plugin\nCan be boolean\nCan be export options"
        },
        "attribute": "exporting",
        "reflect": false,
        "defaultValue": "false"
      },
      "grouping": {
        "type": "unknown",
        "mutable": false,
        "complexType": {
          "original": "GroupingOptions",
          "resolved": "{ props?: ColumnProp[]; expandedAll?: boolean; groupLabelTemplate?: GroupLabelTemplateFunc; }",
          "references": {
            "GroupingOptions": {
              "location": "import",
              "path": "../../plugins/groupingRow/grouping.row.types",
              "id": "src/plugins/groupingRow/grouping.row.types.ts::GroupingOptions"
            }
          }
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Group models by provided properties\nDefine properties to be groped by"
        }
      },
      "stretch": {
        "type": "any",
        "mutable": false,
        "complexType": {
          "original": "boolean | string",
          "resolved": "boolean | string",
          "references": {}
        },
        "required": false,
        "optional": false,
        "docs": {
          "tags": [],
          "text": "Defines stretch strategy for columns with @StretchColumn plugin\nif there are more space on the right last column size would be increased"
        },
        "attribute": "stretch",
        "reflect": false,
        "defaultValue": "true"
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
          "text": "Additional data to be passed to plugins"
        },
        "attribute": "additional-data",
        "reflect": false,
        "defaultValue": "{}"
      }
    };
  }
  static get states() {
    return {
      "extraElements": {}
    };
  }
  static get events() {
    return [{
        "method": "contentsizechanged",
        "name": "contentsizechanged",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "contentsizechanged event.\nTriggered when new content size applied.\nNot including header size\nEvent is not returning size\nTo get actual size use getContentSize after event triggered"
        },
        "complexType": {
          "original": "RevoGrid.MultiDimensionType",
          "resolved": "\"colPinEnd\" | \"colPinStart\" | \"rgCol\" | \"rgRow\" | \"rowPinEnd\" | \"rowPinStart\"",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "beforeedit",
        "name": "beforeedit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before edit event.\nTriggered before edit data applied.\nUse e.preventDefault() to prevent edit data set and use you own.\nUse e.val = {your value} to replace edit result with your own."
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
        "method": "beforerangeedit",
        "name": "beforerangeedit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before range edit event.\nTriggered before range data applied, when range selection happened.\nUse e.preventDefault() to prevent edit data set and use you own."
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
        "method": "afteredit",
        "name": "afteredit",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "After edit.\nTriggered after data applied or range changed."
        },
        "complexType": {
          "original": "Edition.BeforeSaveDataDetails | Edition.BeforeRangeSaveDataDetails",
          "resolved": "{ data: DataLookup; models: { [rowIndex: number]: DataType; }; type: DimensionRows; } | { prop: ColumnProp; model: DataType; val?: string; rowIndex: number; colIndex: number; colType: DimensionCols; type: DimensionRows; }",
          "references": {
            "Edition": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Edition"
            }
          }
        }
      }, {
        "method": "beforeautofill",
        "name": "beforeautofill",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before autofill.\nTriggered before autofill applied.\nUse e.preventDefault() to prevent edit data apply."
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
        "method": "beforeange",
        "name": "beforeange",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before range apply.\nTriggered before range applied.\nUse e.preventDefault() to prevent range."
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
        "method": "afterfocus",
        "name": "afterfocus",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Triggered after focus render finished.\nCan be used to access a focus element through @event.target"
        },
        "complexType": {
          "original": "{ model: any; column: RevoGrid.ColumnRegular; }",
          "resolved": "{ model: any; column: ColumnRegular; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "roworderchanged",
        "name": "roworderchanged",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before rgRow order apply.\nUse e.preventDefault() to prevent rgRow order change."
        },
        "complexType": {
          "original": "{ from: number; to: number }",
          "resolved": "{ from: number; to: number; }",
          "references": {}
        }
      }, {
        "method": "beforesourcesortingapply",
        "name": "beforesourcesortingapply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before source update sorting apply.\nUse this event if you intended to prevent sorting on data update.\nUse e.preventDefault() to prevent sorting data change during rows source update."
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "beforesortingapply",
        "name": "beforesortingapply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before sorting apply.\nUse e.preventDefault() to prevent sorting data change."
        },
        "complexType": {
          "original": "{\n    column: RevoGrid.ColumnRegular;\n    order: 'desc' | 'asc';\n    additive: boolean;\n  }",
          "resolved": "{ column: ColumnRegular; order: \"asc\" | \"desc\"; additive: boolean; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "beforesorting",
        "name": "beforesorting",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before sorting event.\nInitial sorting triggered, if this event stops no other event called.\nUse e.preventDefault() to prevent sorting."
        },
        "complexType": {
          "original": "{\n    column: RevoGrid.ColumnRegular;\n    order: 'desc' | 'asc';\n    additive: boolean;\n  }",
          "resolved": "{ column: ColumnRegular; order: \"asc\" | \"desc\"; additive: boolean; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "rowdragstart",
        "name": "rowdragstart",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Row order change started.\nUse e.preventDefault() to prevent rgRow order change.\nUse e.text = 'new name' to change item name on start."
        },
        "complexType": {
          "original": "{ pos: RevoGrid.PositionItem; text: string }",
          "resolved": "{ pos: PositionItem; text: string; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "headerclick",
        "name": "headerclick",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "On header click."
        },
        "complexType": {
          "original": "RevoGrid.ColumnRegular",
          "resolved": "ColumnRegular",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "beforecellfocus",
        "name": "beforecellfocus",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before cell focus changed.\nUse e.preventDefault() to prevent cell focus change."
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
        "method": "beforefocuslost",
        "name": "beforefocuslost",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before grid focus lost happened.\nUse e.preventDefault() to prevent cell focus change."
        },
        "complexType": {
          "original": "FocusedData | null",
          "resolved": "{ model: any; cell: Cell; colType: DimensionCols; rowType: DimensionRows; column?: ColumnRegular; }",
          "references": {
            "FocusedData": {
              "location": "import",
              "path": "./viewport.service",
              "id": "src/components/revoGrid/viewport.service.ts::FocusedData"
            }
          }
        }
      }, {
        "method": "beforesourceset",
        "name": "beforesourceset",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before data apply.\nYou can override data source here"
        },
        "complexType": {
          "original": "{\n    type: RevoGrid.DimensionRows;\n    source: RevoGrid.DataType[];\n  }",
          "resolved": "{ type: DimensionRows; source: DataType[]; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "beforeAnySource",
        "name": "before-any-source",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before data apply.\nYou can override data source here"
        },
        "complexType": {
          "original": "{\n    type: RevoGrid.DimensionRows;\n    source: RevoGrid.DataType[];\n  }",
          "resolved": "{ type: DimensionRows; source: DataType[]; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "aftersourceset",
        "name": "aftersourceset",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "After rows updated"
        },
        "complexType": {
          "original": "{\n    type: RevoGrid.DimensionRows;\n    source: RevoGrid.DataType[];\n  }",
          "resolved": "{ type: DimensionRows; source: DataType[]; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "afterAnySource",
        "name": "after-any-source",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "After all rows updated. Use it if you want to track all changes from sources pinned and main"
        },
        "complexType": {
          "original": "{\n    type: RevoGrid.DimensionRows;\n    source: RevoGrid.DataType[];\n  }",
          "resolved": "{ type: DimensionRows; source: DataType[]; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "beforecolumnsset",
        "name": "beforecolumnsset",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before column update"
        },
        "complexType": {
          "original": "ColumnCollection",
          "resolved": "{ columns: Record<DimensionCols, ColumnRegular[]>; columnByProp: Record<ColumnProp, ColumnRegular[]>; columnGrouping: ColumnGrouping; maxLevel: number; sort: Record<ColumnProp, ColumnRegular>; }",
          "references": {
            "ColumnCollection": {
              "location": "import",
              "path": "../../services/column.data.provider",
              "id": "src/services/column.data.provider.ts::ColumnCollection"
            }
          }
        }
      }, {
        "method": "beforecolumnapplied",
        "name": "beforecolumnapplied",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before column applied but after column set gathered and viewport updated"
        },
        "complexType": {
          "original": "ColumnCollection",
          "resolved": "{ columns: Record<DimensionCols, ColumnRegular[]>; columnByProp: Record<ColumnProp, ColumnRegular[]>; columnGrouping: ColumnGrouping; maxLevel: number; sort: Record<ColumnProp, ColumnRegular>; }",
          "references": {
            "ColumnCollection": {
              "location": "import",
              "path": "../../services/column.data.provider",
              "id": "src/services/column.data.provider.ts::ColumnCollection"
            }
          }
        }
      }, {
        "method": "aftercolumnsset",
        "name": "aftercolumnsset",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Column updated"
        },
        "complexType": {
          "original": "{\n    columns: ColumnCollection;\n    order: Record<RevoGrid.ColumnProp, 'asc' | 'desc'>;\n  }",
          "resolved": "{ columns: ColumnCollection; order: Record<ColumnProp, \"asc\" | \"desc\">; }",
          "references": {
            "ColumnCollection": {
              "location": "import",
              "path": "../../services/column.data.provider",
              "id": "src/services/column.data.provider.ts::ColumnCollection"
            },
            "Record": {
              "location": "global",
              "id": "global::Record"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "beforefilterapply",
        "name": "beforefilterapply",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before filter applied to data source\nUse e.preventDefault() to prevent cell focus change\nUpdate @collection if you wish to change filters"
        },
        "complexType": {
          "original": "{ collection: FilterCollection }",
          "resolved": "{ collection: FilterCollection; }",
          "references": {
            "FilterCollection": {
              "location": "import",
              "path": "../../plugins/filter/filter.plugin",
              "id": "src/plugins/filter/filter.plugin.tsx::FilterCollection"
            }
          }
        }
      }, {
        "method": "beforefiltertrimmed",
        "name": "beforefiltertrimmed",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before filter trimmed values\nUse e.preventDefault() to prevent value trimming and filter apply\nUpdate @collection if you wish to change filters\nUpdate @itemsToFilter if you wish to filter indexes of trimming"
        },
        "complexType": {
          "original": "{ collection: FilterCollection; itemsToFilter: Record<number, boolean> }",
          "resolved": "{ collection: FilterCollection; itemsToFilter: Record<number, boolean>; }",
          "references": {
            "FilterCollection": {
              "location": "import",
              "path": "../../plugins/filter/filter.plugin",
              "id": "src/plugins/filter/filter.plugin.tsx::FilterCollection"
            },
            "Record": {
              "location": "global",
              "id": "global::Record"
            }
          }
        }
      }, {
        "method": "beforetrimmed",
        "name": "beforetrimmed",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before trimmed values\nUse e.preventDefault() to prevent value trimming\nUpdate @trimmed if you wish to filter indexes of trimming"
        },
        "complexType": {
          "original": "{ trimmed: Record<number, boolean>; trimmedType: string; type: string }",
          "resolved": "{ trimmed: Record<number, boolean>; trimmedType: string; type: string; }",
          "references": {
            "Record": {
              "location": "global",
              "id": "global::Record"
            }
          }
        }
      }, {
        "method": "aftertrimmed",
        "name": "aftertrimmed",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Notify trimmed applied"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "viewportscroll",
        "name": "viewportscroll",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Triggered when view port scrolled"
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
        "method": "beforeexport",
        "name": "beforeexport",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before export\nUse e.preventDefault() to prevent export\nReplace data in Event in case you want to modify it in export"
        },
        "complexType": {
          "original": "DataInput",
          "resolved": "{ data: DataType[]; } & ColSource",
          "references": {
            "DataInput": {
              "location": "import",
              "path": "../../plugins/export/types",
              "id": "src/plugins/export/types.ts::DataInput"
            }
          }
        }
      }, {
        "method": "beforeeditstart",
        "name": "beforeeditstart",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before edit started\nUse e.preventDefault() to prevent edit"
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
        "method": "aftercolumnresize",
        "name": "aftercolumnresize",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "After column resize\nGet resized columns"
        },
        "complexType": {
          "original": "{ [index: number]: RevoGrid.ColumnRegular }",
          "resolved": "{ [index: number]: ColumnRegular; }",
          "references": {
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          }
        }
      }, {
        "method": "beforerowdefinition",
        "name": "beforerowdefinition",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "Before row definition"
        },
        "complexType": {
          "original": "{ vals: any; oldVals: any; }",
          "resolved": "{ vals: any; oldVals: any; }",
          "references": {}
        }
      }, {
        "method": "filterconfigchanged",
        "name": "filterconfigchanged",
        "bubbles": true,
        "cancelable": true,
        "composed": true,
        "docs": {
          "tags": [],
          "text": "External subscribe"
        },
        "complexType": {
          "original": "any",
          "resolved": "any",
          "references": {}
        }
      }, {
        "method": "rowheaderschanged",
        "name": "rowheaderschanged",
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
      }];
  }
  static get methods() {
    return {
      "refresh": {
        "complexType": {
          "signature": "(type?: RevoGrid.DimensionRows | 'all') => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
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
          "text": "Refreshes data viewport.\nCan be specific part as rgRow or pinned rgRow or 'all' by default.",
          "tags": []
        }
      },
      "scrollToRow": {
        "complexType": {
          "signature": "(coordinate?: number) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Scrolls view port to specified rgRow index",
          "tags": []
        }
      },
      "scrollToColumnIndex": {
        "complexType": {
          "signature": "(coordinate?: number) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Scrolls view port to specified column index",
          "tags": []
        }
      },
      "scrollToColumnProp": {
        "complexType": {
          "signature": "(prop: RevoGrid.ColumnProp) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
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
          "text": "Scrolls view port to specified column prop",
          "tags": []
        }
      },
      "updateColumns": {
        "complexType": {
          "signature": "(cols: RevoGrid.ColumnRegular[]) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
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
          "text": "Update columns",
          "tags": []
        }
      },
      "addTrimmed": {
        "complexType": {
          "signature": "(trimmed: Record<number, boolean>, trimmedType?: string, type?: RevoGrid.DimensionRows) => Promise<CustomEvent<{ trimmed: Record<number, boolean>; trimmedType: string; type: string; }>>",
          "parameters": [{
              "tags": [],
              "text": ""
            }, {
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
            "CustomEvent": {
              "location": "global",
              "id": "global::CustomEvent"
            },
            "Record": {
              "location": "global",
              "id": "global::Record"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<CustomEvent<{ trimmed: Record<number, boolean>; trimmedType: string; type: string; }>>"
        },
        "docs": {
          "text": "Add trimmed by type",
          "tags": []
        }
      },
      "scrollToCoordinate": {
        "complexType": {
          "signature": "(cell: Partial<Selection.Cell>) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "Partial": {
              "location": "global",
              "id": "global::Partial"
            },
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Scrolls view port to coordinate",
          "tags": []
        }
      },
      "setCellEdit": {
        "complexType": {
          "signature": "(rgRow: number, prop: RevoGrid.ColumnProp, rowSource?: RevoGrid.DimensionRows) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }, {
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
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Bring cell to edit mode",
          "tags": []
        }
      },
      "setCellsFocus": {
        "complexType": {
          "signature": "(cellStart?: Selection.Cell, cellEnd?: Selection.Cell, colType?: string, rowType?: string) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }, {
              "tags": [],
              "text": ""
            }, {
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
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Set focus range",
          "tags": []
        }
      },
      "registerVNode": {
        "complexType": {
          "signature": "(elements: VNode[]) => Promise<void>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "VNode": {
              "location": "import",
              "path": "@stencil/core",
              "id": ""
            }
          },
          "return": "Promise<void>"
        },
        "docs": {
          "text": "Register new virtual node inside of grid\nUsed for additional items creation such as plugin elements",
          "tags": []
        }
      },
      "getSource": {
        "complexType": {
          "signature": "(type?: RevoGrid.DimensionRows) => Promise<RevoGrid.DataType[]>",
          "parameters": [{
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<DataType[]>"
        },
        "docs": {
          "text": "Get data from source",
          "tags": []
        }
      },
      "getVisibleSource": {
        "complexType": {
          "signature": "(type?: RevoGrid.DimensionRows) => Promise<any[]>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "type - type of source"
                }],
              "text": "- type of source"
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<any[]>"
        },
        "docs": {
          "text": "Get data from visible part of source\nTrimmed/filtered rows will be excluded",
          "tags": [{
              "name": "param",
              "text": "type - type of source"
            }]
        }
      },
      "getSourceStore": {
        "complexType": {
          "signature": "(type?: RevoGrid.DimensionRows) => Promise<RowSource>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "type - type of source"
                }],
              "text": "- type of source"
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "RowSource": {
              "location": "import",
              "path": "../data/columnService",
              "id": "src/components/data/columnService.ts::RowSource"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<RowSource>"
        },
        "docs": {
          "text": "Provides access to rows internal store observer\nCan be used for plugin support",
          "tags": [{
              "name": "param",
              "text": "type - type of source"
            }]
        }
      },
      "getColumnStore": {
        "complexType": {
          "signature": "(type?: RevoGrid.DimensionCols) => Promise<ColumnSource>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "type - type of column"
                }],
              "text": "- type of column"
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "ColumnSource": {
              "location": "import",
              "path": "../data/columnService",
              "id": "src/components/data/columnService.ts::ColumnSource"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<ColumnSource>"
        },
        "docs": {
          "text": "Provides access to column internal store observer\nCan be used for plugin support",
          "tags": [{
              "name": "param",
              "text": "type - type of column"
            }]
        }
      },
      "updateColumnSorting": {
        "complexType": {
          "signature": "(column: RevoGrid.ColumnRegular, index: number, order: 'asc' | 'desc', additive: boolean) => Promise<RevoGrid.ColumnRegular>",
          "parameters": [{
              "tags": [{
                  "name": "param",
                  "text": "column - full column details to update"
                }],
              "text": "- full column details to update"
            }, {
              "tags": [{
                  "name": "param",
                  "text": "index - virtual column index"
                }],
              "text": "- virtual column index"
            }, {
              "tags": [{
                  "name": "param",
                  "text": "order - order to apply"
                }],
              "text": "- order to apply"
            }, {
              "tags": [],
              "text": ""
            }],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<ColumnRegular>"
        },
        "docs": {
          "text": "Update column sorting",
          "tags": [{
              "name": "param",
              "text": "column - full column details to update"
            }, {
              "name": "param",
              "text": "index - virtual column index"
            }, {
              "name": "param",
              "text": "order - order to apply"
            }]
        }
      },
      "clearSorting": {
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
          "text": "Clears column sorting",
          "tags": []
        }
      },
      "getColumns": {
        "complexType": {
          "signature": "() => Promise<RevoGrid.ColumnRegular[]>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "RevoGrid": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoGrid"
            }
          },
          "return": "Promise<ColumnRegular[]>"
        },
        "docs": {
          "text": "Receive all columns in data source",
          "tags": []
        }
      },
      "clearFocus": {
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
          "text": "Clear current grid focus",
          "tags": []
        }
      },
      "getPlugins": {
        "complexType": {
          "signature": "() => Promise<RevoPlugin.Plugin[]>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "RevoPlugin": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::RevoPlugin"
            }
          },
          "return": "Promise<Plugin[]>"
        },
        "docs": {
          "text": "Get all active plugins instances",
          "tags": []
        }
      },
      "getFocused": {
        "complexType": {
          "signature": "() => Promise<FocusedData | null>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "FocusedData": {
              "location": "import",
              "path": "./viewport.service",
              "id": "src/components/revoGrid/viewport.service.ts::FocusedData"
            }
          },
          "return": "Promise<FocusedData>"
        },
        "docs": {
          "text": "Get the currently focused cell.",
          "tags": []
        }
      },
      "getContentSize": {
        "complexType": {
          "signature": "() => Promise<Selection.Cell>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            }
          },
          "return": "Promise<Cell>"
        },
        "docs": {
          "text": "Get size of content\nIncluding all pinned data",
          "tags": []
        }
      },
      "getSelectedRange": {
        "complexType": {
          "signature": "() => Promise<Selection.RangeArea | null>",
          "parameters": [],
          "references": {
            "Promise": {
              "location": "global",
              "id": "global::Promise"
            },
            "Selection": {
              "location": "import",
              "path": "../../interfaces",
              "id": "src/interfaces.d.ts::Selection"
            }
          },
          "return": "Promise<RangeArea>"
        },
        "docs": {
          "text": "Get the currently selected Range.",
          "tags": []
        }
      }
    };
  }
  static get elementRef() { return "element"; }
  static get watchers() {
    return [{
        "propName": "columnTypes",
        "methodName": "columnTypesChanged"
      }, {
        "propName": "columns",
        "methodName": "columnChanged"
      }, {
        "propName": "rowSize",
        "methodName": "rowSizeChanged"
      }, {
        "propName": "theme",
        "methodName": "themeChanged"
      }, {
        "propName": "source",
        "methodName": "dataSourceChanged"
      }, {
        "propName": "pinnedBottomSource",
        "methodName": "dataSourceChanged"
      }, {
        "propName": "pinnedTopSource",
        "methodName": "dataSourceChanged"
      }, {
        "propName": "rowDefinitions",
        "methodName": "rowDefChanged"
      }, {
        "propName": "trimmedRows",
        "methodName": "trimmedRowsChanged"
      }, {
        "propName": "grouping",
        "methodName": "groupingChanged"
      }, {
        "propName": "stretch",
        "methodName": "applyStretch"
      }, {
        "propName": "filter",
        "methodName": "applyFilter"
      }, {
        "propName": "rowHeaders",
        "methodName": "rowHeadersChange"
      }];
  }
  static get listeners() {
    return [{
        "name": "touchstart",
        "method": "mousedownHandle",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "mousedown",
        "method": "mousedownHandle",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "touchend",
        "method": "mouseupHandle",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "mouseup",
        "method": "mouseupHandle",
        "target": "document",
        "capture": false,
        "passive": true
      }, {
        "name": "internalRowDragStart",
        "method": "onRowDragStarted",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "internalRowDragEnd",
        "method": "onRowDragEnd",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "internalRowDrag",
        "method": "onRowDrag",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "internalRowMouseMove",
        "method": "onRowMouseMove",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "internalCellEdit",
        "method": "onBeforeEdit",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "internalRangeDataApply",
        "method": "onBeforeRangeEdit",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "internalSelectionChanged",
        "method": "onRangeChanged",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "initialRowDropped",
        "method": "onRowDropped",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "initialHeaderClick",
        "method": "onHeaderClick",
        "target": undefined,
        "capture": false,
        "passive": false
      }, {
        "name": "beforeFocusCell",
        "method": "onCellFocus",
        "target": undefined,
        "capture": false,
        "passive": false
      }];
  }
}
//# sourceMappingURL=revo-grid.js.map
