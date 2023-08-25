/*!
 * Built by Revolist
 */
import { columnTypes } from "../../store/storeTypes";
export default class GridScrollingService {
  constructor(setViewport) {
    this.setViewport = setViewport;
    this.elements = {};
  }
  async scrollService(e, key) {
    let newEvent;
    let event = e;
    for (let elKey in this.elements) {
      if (e.dimension === 'rgCol' && elKey === 'headerRow') {
        continue;
        // pinned column only
      }
      else if (this.isPinnedColumn(key) && e.dimension === 'rgCol') {
        if (elKey === key || !e.delta) {
          continue;
        }
        for (let el of this.elements[elKey]) {
          if (el.changeScroll) {
            newEvent = el.changeScroll(e);
          }
        }
      }
      else {
        for (let el of this.elements[elKey]) {
          await el.setScroll(e);
        }
      }
    }
    if (newEvent) {
      event = await newEvent;
    }
    this.setViewport(event);
  }
  /**
   * Silent scroll update for mobile devices when we have negative scroll top
   */
  async scrollSilentService(e, key) {
    var _a;
    for (let elKey in this.elements) {
      // skip same element update
      if (elKey === key) {
        continue;
      }
      if (columnTypes.includes(key) && (elKey === 'headerRow' || columnTypes.includes(elKey))) {
        for (let el of this.elements[elKey]) {
          await ((_a = el.changeScroll) === null || _a === void 0 ? void 0 : _a.call(el, e, true));
        }
        continue;
      }
    }
  }
  isPinnedColumn(key) {
    return ['colPinStart', 'colPinEnd'].indexOf(key) > -1;
  }
  registerElements(els) {
    this.elements = els;
  }
  /**
   * Register new element for farther scroll support
   * @param el - can be null if holder removed
   * @param key - element key
   */
  registerElement(el, key) {
    if (!this.elements[key]) {
      this.elements[key] = [];
    }
    // new element added
    if (el) {
      this.elements[key].push(el);
    }
    else if (this.elements[key]) {
      // element removed
      delete this.elements[key];
    }
  }
  unregister() {
    delete this.elements;
    this.elements = {};
  }
}
//# sourceMappingURL=viewport.scrolling.service.js.map
