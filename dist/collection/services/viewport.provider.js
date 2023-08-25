/*!
 * Built by Revolist
 */
import reduce from "lodash/reduce";
import { columnTypes, rowTypes } from "../store/storeTypes";
import ViewportStore from "../store/viewPort/viewport.store";
export default class ViewportProvider {
  constructor() {
    this.stores = reduce([...rowTypes, ...columnTypes], (sources, k) => {
      sources[k] = new ViewportStore(k);
      return sources;
    }, {});
  }
  setViewport(type, data) {
    this.stores[type].setViewport(data);
  }
}
//# sourceMappingURL=viewport.provider.js.map
