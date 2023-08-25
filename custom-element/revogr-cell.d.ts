import type { Components, JSX } from "../dist/types/components";

interface RevogrCell extends Components.RevogrCell, HTMLElement {}
export const RevogrCell: {
  prototype: RevogrCell;
  new (): RevogrCell;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
