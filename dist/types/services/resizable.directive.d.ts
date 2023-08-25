export type ResizeProps = {
  active: ('r' | 'rb' | 'b' | 'lb' | 'l' | 'lt' | 't' | 'rt')[];
  fitParent: boolean;
  minWidth: number;
  minHeight: number;
  disableAttributes: ('l' | 't' | 'w' | 'h')[];
  maxWidth?: number;
  maxHeight?: number;
  onResize?(e: ResizeEvent): void;
  onDoubleClick?(originalEvent: MouseEvent): void;
};
export type ResizeEvent = {
  eventName: string;
  changedX?: number;
  changedY?: number;
  width?: number;
  height?: number;
};
export declare enum ResizeEvents {
  start = "resize:start",
  move = "resize:move",
  end = "resize:end"
}
export declare class ResizeDirective {
  private initialProps;
  private $event?;
  private $el;
  private props;
  private minW;
  private minH;
  private maxW;
  private maxH;
  private mouseX;
  private mouseY;
  private width;
  private height;
  private changeX;
  private changeY;
  private parent;
  private resizeState;
  private activeResizer;
  private disableCalcMap;
  private mouseMoveFunc;
  private mouseUpFunc;
  constructor(initialProps: Partial<ResizeProps>, $event?: (e: ResizeEvent) => void);
  set($el: HTMLElement): void;
  emitEvent(eventName: string, additionalOptions?: any): void;
  private static isTouchEvent;
  handleMove(event: MouseEvent | TouchEvent): void;
  handleDown(event: MouseEvent | TouchEvent): void;
  handleUp(e: MouseEvent): void;
  private setInitials;
  private dropInitial;
  private bindMove;
  private unbindMove;
}
