/*!
 * Built by Revolist
 */
import { h } from "@stencil/core";
import { UUID } from "../../utils/consts";
import { DATA_SLOT, HEADER_SLOT } from "./viewport.helpers";
import { isMobileDevice } from "../../utils/mobile";
/**
 * The code renders a view port divided into sections.
 * It starts by rendering the pinned start, data, and pinned end sections.
 * Within each section, it renders columns along with their headers, pinned top, center data, and pinned bottom.
 * The code iterates over the columns and their data to generate the view port's HTML structure.
 * Finally, the rendered sections are returned as the result.
 */
export const ViewPortSections = ({ resize, editors, rowClass, readonly, range, columns, useClipboard, columnFilter, applyEditorChangesOnClose, additionalData, onCancelEdit, registerElement, onEdit, scrollSection, focusTemplate, onSelectAll, scrollSectionSilent, }) => {
  const isMobile = isMobileDevice();
  const viewPortHtml = [];
  /** render viewports columns */
  for (let view of columns) {
    /** render viewports rows */
    const headerProperties = Object.assign(Object.assign({}, view.headerProp), { type: view.type, additionalData, viewportCol: view.viewportCol, selectionStore: view.columnSelectionStore, canResize: resize, columnFilter });
    const dataViews = [
      h("revogr-header", Object.assign({}, headerProperties, { slot: HEADER_SLOT })),
    ];
    view.dataPorts.forEach((data, j) => {
      const key = view.prop.key + (j + 1);
      const dataView = (h("revogr-overlay-selection", Object.assign({}, data, { isMobileDevice: isMobile, selectionStore: data.segmentSelectionStore, onSelectall: () => onSelectAll(), editors: editors, readonly: readonly, range: range, useClipboard: useClipboard, onCancelEdit: () => onCancelEdit(), applyChangesOnClose: applyEditorChangesOnClose, onSetEdit: ({ detail }) => onEdit(detail), additionalData: additionalData, slot: data.slot }), h("revogr-data", Object.assign({}, data, { [UUID]: data.uuid }, { key: key, readonly: readonly, range: range, rowClass: rowClass, rowSelectionStore: data.rowSelectionStore, additionalData: additionalData, slot: DATA_SLOT }), h("slot", { name: `data-${view.type}-${data.type}` })), h("revogr-temp-range", { selectionStore: data.segmentSelectionStore, dimensionRow: data.dimensionRow, dimensionCol: data.dimensionCol }), h("revogr-focus", { colData: data.colData, dataStore: data.dataStore, focusTemplate: focusTemplate, rowType: data.type, colType: view.type, selectionStore: data.segmentSelectionStore, dimensionRow: data.dimensionRow, dimensionCol: data.dimensionCol }, h("slot", { name: `focus-${view.type}-${data.type}` }))));
      dataViews.push(dataView);
    });
    viewPortHtml.push(h("revogr-viewport-scroll", Object.assign({}, view.prop, { ref: el => registerElement(el, view.prop.key), onScrollViewport: e => scrollSection(e.detail, view.prop.key), onSilentScroll: e => scrollSectionSilent(e.detail, view.prop.key) }), dataViews));
  }
  return viewPortHtml;
};
//# sourceMappingURL=viewport.section.js.map
