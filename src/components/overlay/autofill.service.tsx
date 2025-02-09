import debounce from 'lodash/debounce';
import { DebouncedFunc } from 'lodash';

import { h } from '@stencil/core';
import { CELL_HANDLER_CLASS, MOBILE_CLASS } from '../../utils/consts';
import { Observable, Selection, RevoGrid, Edition } from '../../interfaces';
import { EventData, getCell, getCurrentCell, isAfterLast } from './selection.utils';
import { getRange } from '../../store/selection/selection.helpers';
import SelectionStoreService from '../../store/selection/selection.store.service';
import ColumnService from '../data/columnService';
import { DataSourceState, getSourceItem } from '../../store/dataSource/data.store';
import { getFromEvent } from '../../utils/events';

type Config = {
  selectionStoreService: SelectionStoreService;
  dimensionRow: Observable<RevoGrid.DimensionSettingsState>;
  dimensionCol: Observable<RevoGrid.DimensionSettingsState>;
  columnService: ColumnService;
  dataStore: Observable<DataSourceState<RevoGrid.DataType, RevoGrid.DimensionRows>>;

  setTempRange(e: Selection.TempRange | null): Event;
  selectionChanged(e: Selection.ChangedRange): Event;
  rangeCopy(e: Selection.ChangedRange): Event;
  rangeDataApply(e: Edition.BeforeRangeSaveDataDetails): CustomEvent;
  setRange(e: Selection.RangeArea): boolean;
  clearRangeDataApply(e: {
    range: Selection.RangeArea
  }): CustomEvent<{
    range: Selection.RangeArea
  }>;

  getData(): any;
};

enum AutoFillType {
  selection = 'Selection',
  autoFill = 'AutoFill',
}

export class AutoFillService {
  private autoFillType: AutoFillType | null = null;
  private autoFillInitial: Selection.Cell | null = null;
  private autoFillStart: Selection.Cell | null = null;
  private autoFillLast: Selection.Cell | null = null;

  private onMouseMoveAutofill: DebouncedFunc<(e: MouseEvent | TouchEvent, data: EventData) => void>;

  constructor(private sv: Config) {}

  /**
   * Render autofill box
   * @param range
   * @param selectionFocus
   */
  renderAutofill(range: Selection.RangeArea, selectionFocus: Selection.Cell) {
    let handlerStyle;
    if (range) {
      handlerStyle = getCell(range, this.sv.dimensionRow.state, this.sv.dimensionCol.state);
    } else {
      handlerStyle = getCell(
        {
          ...selectionFocus,
          x1: selectionFocus.x,
          y1: selectionFocus.y,
        },
        this.sv.dimensionRow.state,
        this.sv.dimensionCol.state,
      );
    }
    return (
      <div
        class={{
          [CELL_HANDLER_CLASS]: true,
          [MOBILE_CLASS]: true,
        }}
        style={{ left: `${handlerStyle.right}px`, top: `${handlerStyle.bottom}px` }}
        onMouseDown={(e: MouseEvent) => this.autoFillHandler(e)}
        onTouchStart={(e: TouchEvent) => this.autoFillHandler(e)}
      />
    );
  }

  private autoFillHandler(e: MouseEvent | TouchEvent, type = AutoFillType.autoFill) {
    let target: Element | null = null;
    if (e.target instanceof Element) {
      target = e.target;
    }
    if (!target) {
      return;
    }
    this.selectionStart(target, this.sv.getData(), type);
    e.preventDefault();
  }

  get isAutoFill() {
    return !!this.autoFillType;
  }

  /** Process mouse move events */
  selectionMouseMove(e: MouseEvent | TouchEvent) {
    // initiate mouse move debounce if not present
    if (!this.onMouseMoveAutofill) {
      this.onMouseMoveAutofill = debounce((e: MouseEvent | TouchEvent, data: EventData) => this.doAutofillMouseMove(e, data), 5);
    }
    if (this.isAutoFill) {
      this.onMouseMoveAutofill(e, this.sv.getData());
    }
  }

  private getFocus() {
    let focus = this.sv.selectionStoreService.focused;
    const range = this.sv.selectionStoreService.ranged;
    // there was an issue that it was taking last cell from range but focus was out
    if (!focus && range) {
      focus = { x: range.x, y: range.y };
    }
    return focus || null;
  }

  /**
   * Autofill logic:
   * on mouse move apply based on previous direction (if present)
   */
  private doAutofillMouseMove(event: MouseEvent | TouchEvent, data: EventData) {
    // if no initial - not started
    if (!this.autoFillInitial) {
      return;
    }
    const x = getFromEvent(event, 'clientX', MOBILE_CLASS);
    const y = getFromEvent(event, 'clientY', MOBILE_CLASS);
    // skip touch
    if (x === null || y === null) {
      return;
    }
    const current = getCurrentCell({ x, y }, data);

    // first time or direction equal to start(same as first time)
    if (!this.autoFillLast) {
      if (!this.autoFillLast) {
        this.autoFillLast = this.autoFillStart;
      }
    }

    // check if not the latest, if latest - do nothing
    if (isAfterLast(current, data)) {
      return;
    }
    this.autoFillLast = current;

    const isSame = current.x === this.autoFillInitial.x && current.y === this.autoFillInitial.y;
    // if same as initial - clear
    if (isSame) {
      this.sv.setTempRange(null);
    } else {
      this.sv.setTempRange({
        area: getRange(this.autoFillInitial, this.autoFillLast),
        type: this.autoFillType,
      });
    }
  }

  /**
   * Range selection started
   * Mode @param type:
   * Can be triggered from MouseDown selection on element
   * Or can be triggered on corner square drag
   */
  selectionStart(target: Element, data: EventData, type = AutoFillType.selection) {
    /** Get cell by autofill element */
    const { top, left } = target.getBoundingClientRect();
    this.autoFillInitial = this.getFocus();
    this.autoFillType = type;
    this.autoFillStart = getCurrentCell({ x: left, y: top }, data);
  }

  /**
   * Clear current range selection
   * on mouse up and mouse leave events
   */ 
  clearAutoFillSelection() {
    // Apply autofill values on mouse up if present
    if (this.autoFillInitial) {
      // Get latest
      this.autoFillInitial = this.getFocus();

      // Apply range data if present
      if (this.autoFillType === AutoFillType.autoFill) {
        const range = getRange(this.autoFillInitial, this.autoFillLast);
        if (range) {
          const {
            defaultPrevented: stopApply,
            detail: { range: newRange }
          } = this.sv.clearRangeDataApply({
            range,
          });
          if (!stopApply) {
            this.applyRangeWithData(newRange);
          } else {
            // if prevented - clear temp range
            this.sv.setTempRange(null);
          }
        }
      } else {
        this.applyRangeOnly(this.autoFillInitial, this.autoFillLast);
      }
    }

    this.autoFillType = null;
    this.autoFillInitial = null;
    this.autoFillLast = null;
    this.autoFillStart = null;
  }

  /** Trigger range apply events and handle responses */
  onRangeApply(data: RevoGrid.DataLookup, range: Selection.RangeArea): void {
    const models: RevoGrid.DataLookup = {};
    for (let rowIndex in data) {
      models[rowIndex] = getSourceItem(this.sv.dataStore, parseInt(rowIndex, 10));
    }
    const {
      defaultPrevented: stopRange,
      detail,
    } = this.sv.rangeDataApply({
      data,
      models,
      type: this.sv.dataStore.get('type'),
    });
    if (!stopRange) {
      this.sv.columnService.applyRangeData(detail.data);
    }
    this.sv.setRange(range);
  }

  /** Apply range and copy data during range application */
  private applyRangeWithData(newRange: Selection.RangeArea) {
    const oldRange = this.sv.selectionStoreService.ranged;
    const rangeData: Selection.ChangedRange = {
      type: this.sv.dataStore.get('type'),
      colType: this.sv.columnService.type,
      newData: {},
      mapping: {},
      newRange,
      oldRange,
    };
    const { mapping, changed } = this.sv.columnService.getRangeData(rangeData, this.sv.columnService.columns);
    rangeData.newData = changed;
    rangeData.mapping = mapping;
    let e = this.sv.selectionChanged(rangeData);

    // if default prevented - clear range
    if (e.defaultPrevented) {
      this.sv.setTempRange(null);
      return;
    }

    e = this.sv.rangeCopy(rangeData);
    if (e.defaultPrevented) {
      this.sv.setRange(newRange);
      return;
    }
    this.onRangeApply(rangeData.newData, newRange);
  }

  /**
   * Update range selection only,
   * no data change (mouse selection)
   */
  private applyRangeOnly(start?: Selection.Cell, end?: Selection.Cell) {
    // no changes to apply
    if (!start || !end) {
      return;
    }

    const newRange = getRange(start, end);
    this.sv.setRange(newRange);
  }
}
