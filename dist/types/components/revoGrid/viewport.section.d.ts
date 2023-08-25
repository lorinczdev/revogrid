import { VNode } from '../../stencil-public-runtime';
import { Edition, RevoGrid } from '../../interfaces';
import { ElementScroll } from './viewport';
import { ViewportProps } from './viewport.interfaces';
type Props = {
  editors: Edition.Editors;
  useClipboard: boolean;
  applyEditorChangesOnClose: boolean;
  readonly: boolean;
  range: boolean;
  rowClass: string;
  resize: boolean;
  columns: ViewportProps[];
  columnFilter: boolean;
  additionalData: any;
  focusTemplate: RevoGrid.FocusTemplateFunc;
  scrollSection(e: RevoGrid.ViewPortScrollEvent, key?: RevoGrid.DimensionColPin | string): void;
  scrollSectionSilent(e: RevoGrid.ViewPortScrollEvent, key?: RevoGrid.DimensionColPin | string): void;
  onCancelEdit(): void;
  onEdit(edit: Edition.BeforeEdit): void;
  onSelectAll(): void;
  registerElement(el: ElementScroll | null, key: string): void;
};
/**
 * The code renders a view port divided into sections.
 * It starts by rendering the pinned start, data, and pinned end sections.
 * Within each section, it renders columns along with their headers, pinned top, center data, and pinned bottom.
 * The code iterates over the columns and their data to generate the view port's HTML structure.
 * Finally, the rendered sections are returned as the result.
 */
export declare const ViewPortSections: ({ resize, editors, rowClass, readonly, range, columns, useClipboard, columnFilter, applyEditorChangesOnClose, additionalData, onCancelEdit, registerElement, onEdit, scrollSection, focusTemplate, onSelectAll, scrollSectionSilent, }: Props) => VNode[];
export {};
