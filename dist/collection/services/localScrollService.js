/*!
 * Built by Revolist
 */
import { scaleValue } from "../utils";
const initialParams = {
  contentSize: 0,
  clientSize: 0,
  virtualSize: 0,
  maxSize: 0,
};
const NO_COORDINATE = -1;
export default class LocalScrollService {
  constructor(cfg) {
    this.cfg = cfg;
    this.preventArtificialScroll = { rgRow: null, rgCol: null };
    // to check if scroll changed
    this.previousScroll = { rgRow: NO_COORDINATE, rgCol: NO_COORDINATE };
    this.params = { rgRow: Object.assign({}, initialParams), rgCol: Object.assign({}, initialParams) };
  }
  static getVirtualContentSize(contentSize, clientSize, virtualSize = 0) {
    return contentSize + (virtualSize ? clientSize - virtualSize : 0);
  }
  setParams(params, dimension) {
    const virtualContentSize = LocalScrollService.getVirtualContentSize(params.contentSize, params.clientSize, params.virtualSize);
    this.params[dimension] = Object.assign(Object.assign({}, params), { maxSize: virtualContentSize - params.clientSize, virtualContentSize });
  }
  // apply scroll values after scroll done
  async setScroll(e) {
    this.cancelScroll(e.dimension);
    const frameAnimation = new Promise((resolve, reject) => {
      // for example safari desktop has issues with animation frame
      if (this.cfg.skipAnimationFrame) {
        return resolve();
      }
      const animationId = window.requestAnimationFrame(() => {
        resolve();
      });
      this.preventArtificialScroll[e.dimension] = reject.bind(null, animationId);
    });
    try {
      await frameAnimation;
      const params = this.getParams(e.dimension);
      e.coordinate = Math.ceil(e.coordinate);
      this.previousScroll[e.dimension] = this.wrapCoordinate(e.coordinate, params);
      this.preventArtificialScroll[e.dimension] = null;
      this.cfg.afterScroll(Object.assign(Object.assign({}, e), { coordinate: params.virtualSize ? this.convert(e.coordinate, params, false) : e.coordinate }));
    }
    catch (id) {
      window.cancelAnimationFrame(id);
    }
  }
  // initiate scrolling event
  scroll(coordinate, dimension, force = false, delta, outside = false) {
    this.cancelScroll(dimension);
    if (!force && this.previousScroll[dimension] === coordinate) {
      this.previousScroll[dimension] = NO_COORDINATE;
      return;
    }
    const param = this.getParams(dimension);
    this.cfg.beforeScroll({
      dimension: dimension,
      coordinate: param.virtualSize ? this.convert(coordinate, param) : coordinate,
      delta,
      outside
    });
  }
  getParams(dimension) {
    return this.params[dimension];
  }
  // check if scroll outside of region to avoid looping
  wrapCoordinate(c, param) {
    if (c < 0) {
      return NO_COORDINATE;
    }
    if (c > param.maxSize) {
      return param.maxSize;
    }
    return c;
  }
  // prevent already started scroll, performance optimization
  cancelScroll(dimension) {
    const canceler = this.preventArtificialScroll[dimension];
    if (canceler) {
      canceler();
      this.preventArtificialScroll[dimension] = null;
    }
  }
  /* convert virtual to real and back, scale range */
  convert(pos, param, toReal = true) {
    const minRange = param.clientSize;
    const from = [0, param.virtualContentSize - minRange];
    const to = [0, param.contentSize - param.virtualSize];
    if (toReal) {
      return scaleValue(pos, from, to);
    }
    return scaleValue(pos, to, from);
  }
}
//# sourceMappingURL=localScrollService.js.map
