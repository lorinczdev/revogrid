import { EventEmitter } from '../../stencil-public-runtime';
import { RevoGrid } from '../../interfaces';
export declare class Clipboard {
  /**
   * If readonly mode enables no need for Paste event
   */
  readonly: boolean;
  /**
   * Fired when region pasted
   * @event pasteregion
   * @property {string[][]} data - data to paste
   * @property {boolean} defaultPrevented - if true, paste will be canceled
   */
  pasteRegion: EventEmitter<string[][]>;
  /**
   * Fired before paste applied to the grid
   * @event beforepaste
   * @property {string} raw - raw data from clipboard
   * @property {ClipboardEvent} event - original event
   * @property {boolean} defaultPrevented - if true, paste will be canceled
   */
  beforePaste: EventEmitter;
  /**
   * Fired before paste applied to the grid and after data parsed
   * @event beforepasteapply
   * @property {string} raw - raw data from clipboard
   * @property {string[][]} parsed - parsed data
   */
  beforePasteApply: EventEmitter;
  /**
   * Fired after paste applied to the grid
   * @event afterpasteapply
   * @property {string} raw - raw data from clipboard
   * @property {string[][]} parsed - parsed data
   * @property {ClipboardEvent} event - original event
   * @property {boolean} defaultPrevented - if true, paste will be canceled
   */
  afterPasteApply: EventEmitter;
  /**
   * Fired before cut triggered
   * @event beforecopy
   * @property {ClipboardEvent} event - original event
   * @property {boolean} defaultPrevented - if true, cut will be canceled
   */
  beforeCut: EventEmitter;
  /**
   * Clears region when cut is done
   */
  clearRegion: EventEmitter<DataTransfer>;
  /**
   * Fired before copy triggered
   * @event beforecopy
   * @property {ClipboardEvent} event - original event
   * @property {boolean} defaultPrevented - if true, copy will be canceled
   */
  beforeCopy: EventEmitter;
  /**
   * Fired before copy applied to the clipboard
   * @event beforecopyapply
   * @property {DataTransfer} event - original event
   * @property {string} data - data to copy
   * @property {boolean} defaultPrevented - if true, copy will be canceled
   */
  beforeCopyApply: EventEmitter;
  /**
   * Fired when region copied
   * @event copyregion
   * @property {DataTransfer} data - data to copy
   * @property {boolean} defaultPrevented - if true, copy will be canceled
   */
  copyRegion: EventEmitter<DataTransfer>;
  onPaste(e: ClipboardEvent): void;
  /**
   * Listen to copy event and emit copy region event
   */
  copyStarted(e: ClipboardEvent): void;
  /**
   * Listen to copy event and emit copy region event
   */
  cutStarted(e: ClipboardEvent): void;
  doCopy(e: DataTransfer, data?: RevoGrid.DataFormat[][]): Promise<void>;
  parserCopy(data: RevoGrid.DataFormat[][]): string;
  private textParse;
  private htmlParse;
  private getData;
}
