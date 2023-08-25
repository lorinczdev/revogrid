/*!
 * Built by Revolist
 */
import { setMode } from '@stencil/core/internal/client';
export { setAssetPath, setNonce, setPlatformOptions } from '@stencil/core/internal/client';
import { T as ThemeService, RevoGrid } from './revo-grid.js';
import { RevogrCell } from './revogr-cell.js';
import { RevogrClipboard } from './revogr-clipboard.js';
import { RevogrData } from './revogr-data.js';
import { RevogrEdit } from './revogr-edit.js';
import { RevogrFilterPanel } from './revogr-filter-panel.js';
import { RevogrFocus } from './revogr-focus.js';
import { RevogrHeader } from './revogr-header.js';
import { RevogrOrderEditor } from './revogr-order-editor.js';
import { RevogrOverlaySelection } from './revogr-overlay-selection.js';
import { RevogrRowHeaders } from './revogr-row-headers.js';
import { RevogrScrollVirtual } from './revogr-scroll-virtual.js';
import { RevogrTempRange } from './revogr-temp-range.js';
import { RevogrViewportScroll } from './revogr-viewport-scroll.js';

setMode(elm => {
  let theme = elm.theme || elm.getAttribute('theme');
  if (typeof theme === 'string') {
    theme = theme.trim();
  }
  const parsedTheme = ThemeService.getTheme(theme);
  if (parsedTheme !== theme) {
    elm.setAttribute('theme', parsedTheme);
  }
  return parsedTheme;
});

const defineCustomElements = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      RevoGrid,
      RevogrCell,
      RevogrClipboard,
      RevogrData,
      RevogrEdit,
      RevogrFilterPanel,
      RevogrFocus,
      RevogrHeader,
      RevogrOrderEditor,
      RevogrOverlaySelection,
      RevogrRowHeaders,
      RevogrScrollVirtual,
      RevogrTempRange,
      RevogrViewportScroll,
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { defineCustomElements };

//# sourceMappingURL=index.js.map