import { EventEmitter } from '../../stencil-public-runtime';
import { Edition, RevoGrid } from '../../interfaces';
/**
 * Cell editor component
 */
export declare class RevoEdit {
  element: HTMLElement;
  editCell: Edition.EditCell;
  column: RevoGrid.ColumnRegular | null;
  /** Custom editors register */
  editor: Edition.EditorCtr | null;
  /** Save on editor close */
  saveOnClose: boolean;
  /** Additional data to pass to renderer */
  additionalData: any;
  /** Cell edit event */
  cellEdit: EventEmitter<Edition.SaveDataDetails>;
  /**
   * Close editor event
   * pass true if requires focus next
   */
  closeEdit: EventEmitter<boolean | undefined>;
  /** Edit session editor */
  private currentEditor;
  private saveRunning;
  cancel(): Promise<void>;
  onAutoSave(): void;
  /**
   * Callback triggered on cell editor save
   * Closes editor when called
   * @param preventFocus - if true editor will not be closed and next cell will not be focused
   */
  onSave(val: Edition.SaveData, preventFocus?: boolean): void;
  componentWillRender(): void;
  componentDidRender(): void;
  disconnectedCallback(): void;
  render(): any;
}
