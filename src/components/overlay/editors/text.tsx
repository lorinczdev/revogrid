import { h } from '@stencil/core';
import { isEnterKey, isTab } from '../../../utils/keyCodes.utils';
import { Edition, RevoGrid } from '../../../interfaces';
import { timeout } from '../../../utils';

/**
 * Callback triggered on cell editor save
 * Closes editor when called
 * @param preventFocus - if true editor will not be closed and next cell will not be focused
 */
export type SaveCallback = (value: Edition.SaveData, preventFocus: boolean) => void;

export class TextEditor implements Edition.EditorBase {
  private editInput!: HTMLInputElement;

  public element: Element | null = null;
  public editCell: Edition.EditCell | null = null;

  constructor(public column: RevoGrid.ColumnRegular, private saveCallback?: SaveCallback) {}

  async componentDidRender(): Promise<void> {
    if (this.editInput) {
      await timeout();
      this.editInput?.focus();
    }
  }

  private onKeyDown(e: KeyboardEvent): void {
    const isEnter = isEnterKey(e.code);
    const isKeyTab = isTab(e.code);

    if ((isKeyTab || isEnter) && e.target && this.saveCallback && !e.isComposing) {
      // blur is needed to avoid autoscroll
      this.editInput.blur();
      // request callback which will close cell after all
      this.saveCallback(this.getValue(), isKeyTab);
    }
  }
  
  getValue() {
    return this.editInput?.value;
  }

  // required
  render() {
    return (
      <input
        type="text"
        value={this.editCell?.val || ''}
        ref={el => {
          this.editInput = el;
        }}
        onKeyDown={e => this.onKeyDown(e)}
      />
    );
  }
}
