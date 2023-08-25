/*!
 * Built by Revolist
 */
import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { c as createStore, d as setStore, D as DataStore } from './data.store.js';
import { a as getItemByPosition } from './dimension.helpers.js';
import { j as ROW_HEADER_TYPE, U as UUID } from './consts.js';
import { H as HEADER_SLOT, d as defineCustomElement$1 } from './revogr-viewport-scroll2.js';
import { d as defineCustomElement$4 } from './revogr-cell2.js';
import { d as defineCustomElement$3 } from './revogr-data2.js';
import { a as defineCustomElement$2 } from './revogr-header2.js';

/**
 * Update items based on new scroll position
 * If viewport wasn't changed fully simple recombination of positions
 * Otherwise rebuild viewport items
 */
function getUpdatedItemsByPosition(pos, // coordinate
items, realCount, virtualSize, dimension) {
  const activeItem = getItemByPosition(dimension, pos);
  const firstItem = getFirstItem(items);
  let toUpdate;
  // do simple position recombination if items already present in viewport
  if (firstItem) {
    let changedOffsetStart = activeItem.itemIndex - (firstItem.itemIndex || 0);
    // if item changed
    if (changedOffsetStart) {
      // simple recombination
      toUpdate = recombineByOffset(Math.abs(changedOffsetStart), Object.assign(Object.assign({ positiveDirection: changedOffsetStart > -1 }, dimension), items));
    }
  }
  const maxSizeVirtualSize = getMaxVirtualSize(virtualSize, dimension.realSize, activeItem);
  // if partial recombination add items if revo-viewport has some space left
  if (toUpdate) {
    const extra = addMissingItems(activeItem, realCount, maxSizeVirtualSize, toUpdate, dimension);
    if (extra.length) {
      updateMissingAndRange(toUpdate.items, extra, toUpdate);
    }
  }
  // new collection if no items after replacement full replacement
  if (!toUpdate) {
    const items = getItems({
      firstItemStart: activeItem.start,
      firstItemIndex: activeItem.itemIndex,
      origSize: dimension.originItemSize,
      maxSize: maxSizeVirtualSize,
      maxCount: realCount,
      sizes: dimension.sizes,
    });
    // range now comes from 0 to length - 1
    toUpdate = {
      items,
      start: 0,
      end: items.length - 1,
    };
  }
  return toUpdate;
}
// virtual size can differ based on scroll position if some big items are present
// scroll can be in the middle of item and virtual size will be larger
// so we need to exclude this part from virtual size hence it's already passed
function getMaxVirtualSize(virtualSize, realSize, activeItem) {
  return Math.min(virtualSize + (activeItem.end - activeItem.start), realSize);
}
function updateMissingAndRange(items, missing, range) {
  items.splice(range.end + 1, 0, ...missing);
  // update range if start larger after recombination
  if (range.start >= range.end && !(range.start === range.end && range.start === 0)) {
    range.start += missing.length;
  }
  range.end += missing.length;
}
/**
 * If partial replacement
 * this function adds items if viewport has some space left
 */
function addMissingItems(firstItem, realCount, virtualSize, existingCollection, dimension) {
  const lastItem = getLastItem(existingCollection);
  const items = getItems({
    sizes: dimension.sizes,
    firstItemStart: lastItem.end,
    firstItemIndex: lastItem.itemIndex + 1,
    origSize: dimension.originItemSize,
    maxSize: virtualSize - (lastItem.end - firstItem.start),
    maxCount: realCount,
  });
  return items;
}
/**
 * Get wiewport items parameters
 * caching position and calculating items count in viewport
 */
function getItems(opt, currentSize = 0) {
  const items = [];
  let index = opt.firstItemIndex;
  let size = currentSize;
  // max size or max count
  while (size <= opt.maxSize && index < opt.maxCount) {
    const newSize = getItemSize(index, opt.sizes, opt.origSize);
    items.push({
      start: opt.firstItemStart + size,
      end: opt.firstItemStart + size + newSize,
      itemIndex: index,
      size: newSize,
    });
    size += newSize;
    index++;
  }
  return items;
}
function recombineByOffset(offset, data) {
  const newItems = [...data.items];
  const itemsCount = newItems.length;
  let newRange = {
    start: data.start,
    end: data.end,
  };
  // if offset out of revo-viewport, makes sense whole redraw
  if (offset > itemsCount) {
    return null;
  }
  // is direction of scroll positive
  if (data.positiveDirection) {
    // push item to the end
    let lastItem = getLastItem(data);
    let i = newRange.start;
    const length = i + offset;
    for (; i < length; i++) {
      const newIndex = lastItem.itemIndex + 1;
      const size = getItemSize(newIndex, data.sizes, data.originItemSize);
      // if item overlapped limit break a loop
      if (lastItem.end + size > data.realSize) {
        break;
      }
      // new item index to recombine
      let newEnd = i % itemsCount;
      // item should always present, we do not create new item, we recombine them
      if (!newItems[newEnd]) {
        throw new Error('incorrect index');
      }
      // do recombination
      newItems[newEnd] = lastItem = {
        start: lastItem.end,
        end: lastItem.end + size,
        itemIndex: newIndex,
        size: size,
      };
      // update range
      newRange.start++;
      newRange.end = newEnd;
    }
    // direction is negative
  }
  else {
    // push item to the start
    let firstItem = getFirstItem(data);
    const end = newRange.end;
    for (let i = 0; i < offset; i++) {
      const newIndex = firstItem.itemIndex - 1;
      const size = getItemSize(newIndex, data.sizes, data.originItemSize);
      // new item index to recombine
      let newStart = end - i;
      newStart = (newStart < 0 ? itemsCount + newStart : newStart) % itemsCount;
      // item should always present, we do not create new item, we recombine them
      if (!newItems[newStart]) {
        throw new Error('incorrect index');
      }
      // do recombination
      newItems[newStart] = firstItem = {
        start: firstItem.start - size,
        end: firstItem.start,
        itemIndex: newIndex,
        size: size,
      };
      // update range
      newRange.start = newStart;
      newRange.end--;
    }
  }
  const range = {
    start: (newRange.start < 0 ? itemsCount + newRange.start : newRange.start) % itemsCount,
    end: (newRange.end < 0 ? itemsCount + newRange.end : newRange.end) % itemsCount,
  };
  return Object.assign({ items: newItems }, range);
}
function getItemSize(index, sizes, origSize = 0) {
  if (sizes && sizes[index]) {
    return sizes[index];
  }
  return origSize;
}
/**
 * Verify if position is in range of the PositionItem, start and end are included
 */
function isActiveRange(pos, realSize, first, last) {
  if (!first || !last) {
    return false;
  }
  // if position is in range of first item
  // or position is after first item and last item is the last item in real size
  return pos >= first.start && pos <= first.end ||
    pos > first.end && last.end === realSize;
}
function isActiveRangeOutsideLastItem(pos, virtualSize, firstItem, lastItem) {
  // if no first item, means no items in viewport
  if (!firstItem) {
    return false;
  }
  return virtualSize + pos > (lastItem === null || lastItem === void 0 ? void 0 : lastItem.end);
}
function getFirstItem(s) {
  return s.items[s.start];
}
function getLastItem(s) {
  return s.items[s.end];
}
/**
 * Set items sizes from start index to end
 * @param vpItems
 * @param start
 * @param size
 * @param lastCoordinate
 * @returns
 */
function setItemSizes(vpItems, initialIndex, size, lastCoordinate) {
  const items = [...vpItems];
  const count = items.length;
  let pos = lastCoordinate;
  let i = 0;
  let start = initialIndex;
  // viewport not inited
  if (!count) {
    return [];
  }
  // loop through array from initial item after recombination
  while (i < count) {
    const item = items[start];
    item.start = pos;
    item.size = size;
    item.end = item.start + size;
    pos = item.end;
    // loop by start index
    start++;
    i++;
    // if start index out of array, reset it
    if (start === count) {
      start = 0;
    }
  }
  return items;
}

/**
 * Store is responsible for visible
 * Viewport information for each dimension
 * Redraw items during scrolling
 */
function initialState() {
  return {
    // virtual item information per rendered item
    items: [],
    // virtual dom item order to render
    start: 0,
    end: 0,
    // size of viewport in px
    virtualSize: 0,
    // total number of items
    realCount: 0,
  };
}
class ViewportStore {
  get lastCoordinate() {
    return this.lastKnownScroll;
  }
  set lastCoordinate(value) {
    this.lastKnownScroll = value;
  }
  constructor(type) {
    this.type = type;
    // last coordinate for store position restore
    this.lastKnownScroll = 0;
    this.store = createStore(initialState());
    this.store.onChange('realCount', () => this.clearItems());
    // drop items on virtual size change, require a new item set
    this.store.onChange('virtualSize', () => this.setViewport({ items: [] }));
  }
  /**
   * Render viewport based on coordinate
   * It's the main method for draw
   */
  setViewPortCoordinate(position, dimension) {
    const viewportSize = this.store.get('virtualSize');
    // no visible data to calculate
    if (!viewportSize) {
      return;
    }
    const frameOffset = 1;
    const singleOffsetInPx = dimension.originItemSize * frameOffset;
    // add offset to virtual size from both sides
    const outsize = singleOffsetInPx * 2;
    // math virtual size is based on visible area + 2 items outside of visible area
    const virtualSize = viewportSize + outsize;
    // expected no scroll if real size less than virtual size, position is 0
    let maxCoordinate = 0;
    // if there is nodes outside of viewport, max coordinate has to be adjusted
    if (dimension.realSize > viewportSize) {
      // max coordinate is real size minus virtual/rendered space
      maxCoordinate = dimension.realSize - viewportSize - singleOffsetInPx;
    }
    let pos = position;
    // limit position to max and min coordinates
    if (pos < 0) {
      pos = 0;
    }
    else if (pos > maxCoordinate) {
      pos = maxCoordinate;
    }
    // store last coordinate for further restore on redraw
    this.lastCoordinate = pos;
    // actual position is less than first item start based on offset
    pos -= singleOffsetInPx;
    pos = pos < 0 ? 0 : pos < maxCoordinate ? pos : maxCoordinate;
    const allItems = this.getItems();
    const firstItem = getFirstItem(allItems);
    const lastItem = getLastItem(allItems);
    let toUpdate = {};
    // left position changed
    // verify if new position is in range of previously rendered first item
    if (!isActiveRange(pos, dimension.realSize, firstItem, lastItem)) {
      toUpdate = Object.assign(Object.assign({}, toUpdate), getUpdatedItemsByPosition(pos, allItems, this.store.get('realCount'), virtualSize, dimension));
      this.setViewport(Object.assign({}, toUpdate));
      // verify is render area is outside of last item
    }
    else if (isActiveRangeOutsideLastItem(pos, virtualSize, firstItem, lastItem)) {
      // check is any item missing for full fill content
      const missing = addMissingItems(firstItem, this.store.get('realCount'), virtualSize + pos - firstItem.start, allItems, dimension);
      // update missing items
      if (missing.length) {
        const items = [...this.store.get('items')];
        const range = {
          start: this.store.get('start'),
          end: this.store.get('end'),
        };
        updateMissingAndRange(items, missing, range);
        toUpdate = Object.assign(Object.assign(Object.assign({}, toUpdate), { items: [...items] }), range);
        this.setViewport(Object.assign({}, toUpdate));
      }
    }
  }
  /**
   * Update viewport sizes for existing items
   * This method is generating new item positions based on custom sizes and original sizes
   * @param sizes - custom sizes for each item
   * @param dropToOriginalSize - drop to original size if requested
   */
  setViewPortDimensionSizes(sizes, dropToOriginalSize) {
    let items = [...this.store.get('items')];
    const count = items.length;
    // viewport not inited
    if (!count) {
      return;
    }
    let changedCoordinate = 0;
    let i = 0;
    let start = this.store.get('start');
    // drop to original size if requested
    if (dropToOriginalSize) {
      const allItems = this.getItems();
      const firstItem = getFirstItem(allItems);
      items = setItemSizes(items, start, dropToOriginalSize, firstItem.start);
    }
    // loop through array from initial item after recombination
    // if size change present, change position for all items after
    while (i < count) {
      const item = items[start];
      // change pos if size change present before
      if (changedCoordinate) {
        item.start += changedCoordinate;
        item.end += changedCoordinate;
      }
      // check if size change present
      const size = sizes[item.itemIndex];
      // size found
      if (size) {
        const changedSize = size - item.size;
        changedCoordinate += changedSize;
        item.size = size;
        item.end = item.start + size;
        // size lost
      }
      // loop by start index
      start++;
      i++;
      // if start index out of array, reset it
      if (start === count) {
        start = 0;
      }
    }
    this.setViewport({ items: [...items] });
  }
  /**
   * Set sizes for existing items
   */
  setOriginalSizes(size) {
    const items = this.store.get('items');
    const count = items.length;
    // viewport not inited
    if (!count) {
      return;
    }
    setStore(this.store, {
      items: setItemSizes(items, this.store.get('start'), size, this.lastCoordinate),
    });
  }
  getItems() {
    return {
      items: this.store.get('items'),
      start: this.store.get('start'),
      end: this.store.get('end'),
    };
  }
  setViewport(data) {
    setStore(this.store, data);
  }
  clearItems() {
    this.store.set('items', []);
  }
}

const LETTER_BLOCK_SIZE = 10;
const calculateRowHeaderSize = (itemsLength, rowHeaderColumn) => {
  return (rowHeaderColumn === null || rowHeaderColumn === void 0 ? void 0 : rowHeaderColumn.size) || (itemsLength.toString().length + 1) * LETTER_BLOCK_SIZE;
};

const RowHeaderRender = s => (__, { rowIndex: i }) => s + i;

const RevogrRowHeaders = /*@__PURE__*/ proxyCustomElement(class RevogrRowHeaders extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.scrollViewport = createEvent(this, "scrollViewport", 3);
    this.elementToScroll = createEvent(this, "elementToScroll", 3);
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
}, [0, "revogr-row-headers", {
    "height": [2],
    "dataPorts": [16],
    "headerProp": [16],
    "uiid": [1],
    "rowClass": [1, "row-class"],
    "resize": [4],
    "rowHeaderColumn": [16],
    "additionalData": [8, "additional-data"]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["revogr-row-headers", "revogr-cell", "revogr-data", "revogr-header", "revogr-viewport-scroll"];
  components.forEach(tagName => { switch (tagName) {
    case "revogr-row-headers":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, RevogrRowHeaders);
      }
      break;
    case "revogr-cell":
      if (!customElements.get(tagName)) {
        defineCustomElement$4();
      }
      break;
    case "revogr-data":
      if (!customElements.get(tagName)) {
        defineCustomElement$3();
      }
      break;
    case "revogr-header":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
    case "revogr-viewport-scroll":
      if (!customElements.get(tagName)) {
        defineCustomElement$1();
      }
      break;
  } });
}

export { RevogrRowHeaders as R, ViewportStore as V, calculateRowHeaderSize as c, defineCustomElement as d };

//# sourceMappingURL=revogr-row-headers2.js.map