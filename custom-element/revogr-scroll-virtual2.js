/*!
 * Built by Revolist
 */
import { proxyCustomElement, HTMLElement, createEvent, h, Host } from '@stencil/core/internal/client';
import { L as LocalScrollService } from './localScrollService.js';
import { g as getScrollbarWidth } from './index2.js';

const revogrScrollStyleCss = ".revo-drag-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 438 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M421.875,70.40625 C426.432292,70.40625 430.175781,68.9414062 433.105469,66.0117188 C436.035156,63.0820312 437.5,59.3385417 437.5,54.78125 L437.5,54.78125 L437.5,15.71875 C437.5,11.1614583 436.035156,7.41796875 433.105469,4.48828125 C430.175781,1.55859375 426.432292,0.09375 421.875,0.09375 L421.875,0.09375 L15.625,0.09375 C11.0677083,0.09375 7.32421875,1.55859375 4.39453125,4.48828125 C1.46484375,7.41796875 0,11.1614583 0,15.71875 L0,15.71875 L0,54.78125 C0,59.3385417 1.46484375,63.0820312 4.39453125,66.0117188 C7.32421875,68.9414062 11.0677083,70.40625 15.625,70.40625 L15.625,70.40625 L421.875,70.40625 Z M421.875,226.65625 C426.432292,226.65625 430.175781,225.191406 433.105469,222.261719 C436.035156,219.332031 437.5,215.588542 437.5,211.03125 L437.5,211.03125 L437.5,171.96875 C437.5,167.411458 436.035156,163.667969 433.105469,160.738281 C430.175781,157.808594 426.432292,156.34375 421.875,156.34375 L421.875,156.34375 L15.625,156.34375 C11.0677083,156.34375 7.32421875,157.808594 4.39453125,160.738281 C1.46484375,163.667969 0,167.411458 0,171.96875 L0,171.96875 L0,211.03125 C0,215.588542 1.46484375,219.332031 4.39453125,222.261719 C7.32421875,225.191406 11.0677083,226.65625 15.625,226.65625 L15.625,226.65625 L421.875,226.65625 Z M421.875,382.90625 C426.432292,382.90625 430.175781,381.441406 433.105469,378.511719 C436.035156,375.582031 437.5,371.838542 437.5,367.28125 L437.5,367.28125 L437.5,328.21875 C437.5,323.661458 436.035156,319.917969 433.105469,316.988281 C430.175781,314.058594 426.432292,312.59375 421.875,312.59375 L421.875,312.59375 L15.625,312.59375 C11.0677083,312.59375 7.32421875,314.058594 4.39453125,316.988281 C1.46484375,319.917969 0,323.661458 0,328.21875 L0,328.21875 L0,367.28125 C0,371.838542 1.46484375,375.582031 4.39453125,378.511719 C7.32421875,381.441406 11.0677083,382.90625 15.625,382.90625 L15.625,382.90625 L421.875,382.90625 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:7px;background-size:cover;background-repeat:no-repeat}.revo-alt-icon{-webkit-mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");mask-image:url(\"data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg viewBox='0 0 384 383' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cg%3E%3Cpath d='M192.4375,383 C197.424479,383 201.663411,381.254557 205.154297,377.763672 L205.154297,377.763672 L264.25,318.667969 C270.234375,312.683594 271.605794,306.075846 268.364258,298.844727 C265.122721,291.613607 259.51237,287.998047 251.533203,287.998047 L251.533203,287.998047 L213.382812,287.998047 L213.382812,212.445312 L288.935547,212.445312 L288.935547,250.595703 C288.935547,258.57487 292.551107,264.185221 299.782227,267.426758 C307.013346,270.668294 313.621094,269.296875 319.605469,263.3125 L319.605469,263.3125 L378.701172,204.216797 C382.192057,200.725911 383.9375,196.486979 383.9375,191.5 C383.9375,186.513021 382.192057,182.274089 378.701172,178.783203 L378.701172,178.783203 L319.605469,119.6875 C313.621094,114.201823 307.013346,112.955078 299.782227,115.947266 C292.551107,118.939453 288.935547,124.42513 288.935547,132.404297 L288.935547,132.404297 L288.935547,170.554688 L213.382812,170.554688 L213.382812,95.0019531 L251.533203,95.0019531 C259.51237,95.0019531 264.998047,91.3863932 267.990234,84.1552734 C270.982422,76.9241536 269.735677,70.3164062 264.25,64.3320312 L264.25,64.3320312 L205.154297,5.23632812 C201.663411,1.74544271 197.424479,0 192.4375,0 C187.450521,0 183.211589,1.74544271 179.720703,5.23632812 L179.720703,5.23632812 L120.625,64.3320312 C114.640625,70.3164062 113.269206,76.9241536 116.510742,84.1552734 C119.752279,91.3863932 125.36263,95.0019531 133.341797,95.0019531 L133.341797,95.0019531 L171.492188,95.0019531 L171.492188,170.554688 L95.9394531,170.554688 L95.9394531,132.404297 C95.9394531,124.42513 92.3238932,118.814779 85.0927734,115.573242 C77.8616536,112.331706 71.2539062,113.703125 65.2695312,119.6875 L65.2695312,119.6875 L6.17382812,178.783203 C2.68294271,182.274089 0.9375,186.513021 0.9375,191.5 C0.9375,196.486979 2.68294271,200.725911 6.17382812,204.216797 L6.17382812,204.216797 L65.2695312,263.3125 C71.2539062,268.798177 77.8616536,270.044922 85.0927734,267.052734 C92.3238932,264.060547 95.9394531,258.57487 95.9394531,250.595703 L95.9394531,250.595703 L95.9394531,212.445312 L171.492188,212.445312 L171.492188,287.998047 L133.341797,287.998047 C125.36263,287.998047 119.876953,291.613607 116.884766,298.844727 C113.892578,306.075846 115.139323,312.683594 120.625,318.667969 L120.625,318.667969 L179.720703,377.763672 C183.211589,381.254557 187.450521,383 192.4375,383 Z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\");width:11px;height:11px;background-size:cover;background-repeat:no-repeat}.arrow-down{position:absolute;right:5px;top:0}.arrow-down svg{width:8px;margin-top:5px;margin-left:5px;opacity:0.4}.cell-value-wrapper{margin-right:10px;overflow:hidden;text-overflow:ellipsis}.revo-button{position:relative;overflow:hidden;color:#fff;background-color:#6200ee;height:34px;line-height:34px;padding:0 15px;outline:0;border:0;border-radius:7px;box-sizing:border-box;cursor:pointer}.revo-button.green{background-color:#2ee072;border:1px solid #20d565}.revo-button.red{background-color:#E0662E;border:1px solid #d55920}.revo-button:disabled,.revo-button[disabled]{cursor:not-allowed !important;filter:opacity(0.35) !important}.revo-button.light{border:2px solid #cedefa;line-height:32px;background:none;color:#4876ca;box-shadow:none}revogr-scroll-virtual[auto-hide]{position:absolute;z-index:100}revogr-scroll-virtual[auto-hide].vertical{right:0;top:0}revogr-scroll-virtual[auto-hide].vertical:hover{min-width:20px}revogr-scroll-virtual[auto-hide].horizontal{bottom:0;left:0}revogr-scroll-virtual[auto-hide].horizontal:hover{min-height:20px}revogr-scroll-virtual.vertical{overflow-y:auto;overflow-x:hidden;height:100%}revogr-scroll-virtual.vertical>div{width:1px}revogr-scroll-virtual.horizontal{overflow-x:auto;overflow-y:hidden;width:100%}revogr-scroll-virtual.horizontal>div{height:1px}";

const RevogrScrollVirtual = /*@__PURE__*/ proxyCustomElement(class RevogrScrollVirtual extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.scrollVirtual = createEvent(this, "scrollVirtual", 7);
    this.scrollSize = 0;
    this.isAutoHide = false;
    this.autoHideTimeout = 0;
    this.dimension = 'rgRow';
    this.viewportStore = undefined;
    this.dimensionStore = undefined;
  }
  async setScroll(e) {
    var _a;
    if (this.dimension !== e.dimension) {
      return;
    }
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.setScroll(e);
  }
  // update on delta in case we don't know existing position or external change
  async changeScroll(e) {
    if (e.delta) {
      switch (e.dimension) {
        case 'rgCol':
          e.coordinate = this.element.scrollLeft + e.delta;
          break;
        case 'rgRow':
          e.coordinate = this.element.scrollTop + e.delta;
          break;
      }
      this.setScroll(e);
    }
    return e;
  }
  set size(s) {
    if (this.dimension === 'rgRow') {
      this.element.style.minWidth = `${s}px`;
      return;
    }
    this.element.style.minHeight = `${s}px`;
  }
  get size() {
    if (this.dimension === 'rgRow') {
      return this.element.clientHeight;
    }
    return this.element.clientWidth;
  }
  connectedCallback() {
    this.scrollService = new LocalScrollService({
      beforeScroll: e => this.scrollVirtual.emit(e),
      afterScroll: e => {
        const type = e.dimension === 'rgRow' ? 'scrollTop' : 'scrollLeft';
        this.element[type] = e.coordinate;
      },
    });
  }
  disconnectedCallback() {
    clearTimeout(this.autoHideTimeout);
  }
  componentWillLoad() {
    this.scrollSize = getScrollbarWidth(document);
    this.isAutoHide = !this.scrollSize;
  }
  componentDidRender() {
    const type = this.dimension === 'rgRow' ? 'scrollHeight' : 'scrollWidth';
    if (this.element[type] > this.size) {
      this.size = this.scrollSize;
    }
    else {
      this.size = 0;
    }
    this.scrollService.setParams({
      contentSize: this.dimensionStore.get('realSize'),
      clientSize: this.size,
      virtualSize: this.viewportStore.get('virtualSize'),
    }, this.dimension);
  }
  onScroll(e) {
    var _a;
    let type = 'scrollLeft';
    if (this.dimension === 'rgRow') {
      type = 'scrollTop';
    }
    if (this.isAutoHide) {
      this.size = 20;
      this.autoHideTimeout = this.autoHide(this.autoHideTimeout);
    }
    const target = e.target;
    (_a = this.scrollService) === null || _a === void 0 ? void 0 : _a.scroll(target[type] || 0, this.dimension);
  }
  autoHide(timeout) {
    clearTimeout(timeout);
    return setTimeout(() => {
      this.size = 0;
    }, 6000);
  }
  render() {
    const sizeType = this.dimension === 'rgRow' ? 'height' : 'width';
    return (h(Host, Object.assign({}, { 'auto-hide': this.isAutoHide }, { onScroll: (e) => this.onScroll(e) }), h("div", { style: { [sizeType]: `${this.extContentSize(this.viewportStore.get('virtualSize'), this.dimensionStore.get('realSize'))}px` } })));
  }
  extContentSize(vsize, contentSize) {
    return LocalScrollService.getVirtualContentSize(contentSize, this.size, vsize);
  }
  get element() { return this; }
  static get style() { return revogrScrollStyleCss; }
}, [0, "revogr-scroll-virtual", {
    "dimension": [1],
    "viewportStore": [16],
    "dimensionStore": [16],
    "setScroll": [64],
    "changeScroll": [64]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["revogr-scroll-virtual"];
  components.forEach(tagName => { switch (tagName) {
    case "revogr-scroll-virtual":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, RevogrScrollVirtual);
      }
      break;
  } });
}

export { RevogrScrollVirtual as R, defineCustomElement as d };

//# sourceMappingURL=revogr-scroll-virtual2.js.map