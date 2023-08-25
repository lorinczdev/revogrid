/*!
 * Built by Revolist
 */
import { each } from "lodash";
import { calculateRowHeaderSize } from "../utils/row-header-utils";
import { getScrollbarWidth } from "../utils";
import BasePlugin from "./basePlugin";
export default class StretchColumn extends BasePlugin {
  constructor(revogrid, providers) {
    super(revogrid);
    this.providers = providers;
    this.stretchedColumn = null;
    // calculate scroll bar size for current user session
    this.scrollSize = getScrollbarWidth(document);
    // subscribe to column changes
    const beforecolumnapplied = ({ detail: { columns } }) => this.applyStretch(columns);
    this.addEventListener('beforecolumnapplied', beforecolumnapplied);
  }
  setScroll({ type, hasScroll }) {
    var _a;
    if (type === 'rgRow' && this.stretchedColumn && ((_a = this.stretchedColumn) === null || _a === void 0 ? void 0 : _a.initialSize) === this.stretchedColumn.size) {
      if (hasScroll) {
        this.stretchedColumn.size -= this.scrollSize;
        this.apply();
        this.dropChanges();
      }
    }
  }
  activateChanges() {
    const setScroll = ({ detail }) => this.setScroll(detail);
    this.addEventListener('scrollchange', setScroll);
  }
  dropChanges() {
    this.stretchedColumn = null;
    this.removeEventListener('scrollchange');
  }
  apply() {
    if (!this.stretchedColumn) {
      return;
    }
    const type = 'rgCol';
    const sizes = this.providers.dimensionProvider.stores[type].store.get('sizes');
    this.providers.dimensionProvider.setCustomSizes(type, Object.assign(Object.assign({}, sizes), { [this.stretchedColumn.index]: this.stretchedColumn.size }), true);
  }
  /**
   * Apply stretch changes
   */
  applyStretch(columns) {
    // unsubscribe from all events
    this.dropChanges();
    // calculate grid size
    let sizeDifference = this.revogrid.clientWidth - 1;
    each(columns, (_, type) => {
      const realSize = this.providers.dimensionProvider.stores[type].store.get('realSize');
      sizeDifference -= realSize;
    });
    if (this.revogrid.rowHeaders) {
      const itemsLength = this.providers.dataProvider.stores.rgRow.store.get('source').length;
      const header = this.revogrid.rowHeaders;
      const rowHeaderSize = calculateRowHeaderSize(itemsLength, typeof header === 'object' ? header : undefined);
      if (rowHeaderSize) {
        sizeDifference -= rowHeaderSize;
      }
    }
    if (sizeDifference > 0) {
      // currently plugin accepts last column only
      const index = columns.rgCol.length - 1;
      const last = columns.rgCol[index];
      /**
       * has column
       * no auto size applied
       * size for column shouldn't be defined
       */
      const colSize = (last === null || last === void 0 ? void 0 : last.size) || this.revogrid.colSize || 0;
      const size = sizeDifference + colSize - 1;
      if (last && !last.autoSize && colSize < size) {
        this.stretchedColumn = {
          initialSize: size,
          index,
          size,
        };
        this.apply();
        this.activateChanges();
      }
    }
  }
}
/**
 * Check plugin type is Stretch
 */
export function isStretchPlugin(plugin) {
  return !!plugin.applyStretch;
}
//# sourceMappingURL=stretchPlugin.js.map
