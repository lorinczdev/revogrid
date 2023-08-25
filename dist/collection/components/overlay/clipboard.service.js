/*!
 * Built by Revolist
 */
import { h } from "@stencil/core";
import { getRange } from "../../store/selection/selection.helpers";
export class ClipboardService {
  constructor(sv) {
    this.sv = sv;
  }
  renderClipboard(readonly = false) {
    return h("revogr-clipboard", { readonly: readonly, onCopyRegion: e => this.onCopy(e.detail), onClearRegion: () => this.sv.rangeClear(), ref: e => (this.clipboard = e), onPasteRegion: e => this.onPaste(e.detail) });
  }
  getRegion() {
    const focus = this.sv.selectionStoreService.focused;
    let range = this.sv.selectionStoreService.ranged;
    if (!range) {
      range = getRange(focus, focus);
    }
    return range;
  }
  onCopy(e) {
    const range = this.getRegion();
    const canCopyEvent = this.sv.beforeCopy(range);
    if (canCopyEvent.defaultPrevented) {
      return false;
    }
    const data = this.sv.rangeCopy(range);
    this.clipboard.doCopy(e, data);
    return true;
  }
  onPaste(data) {
    const focus = this.sv.selectionStoreService.focused;
    const isEditing = this.sv.selectionStoreService.edited !== null;
    if (!focus || isEditing) {
      return;
    }
    let { changed, range } = this.sv.columnService.getTransformedDataToApply(focus, data);
    const { defaultPrevented: canPaste } = this.sv.beforePaste(changed, range);
    if (canPaste) {
      return;
    }
    this.sv.rangeApply(changed, range);
  }
}
//# sourceMappingURL=clipboard.service.js.map
