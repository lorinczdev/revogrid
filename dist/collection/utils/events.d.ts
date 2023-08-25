export declare function verifyTouchTarget(touchEvent?: Touch, focusClass?: string): boolean;
export declare function getFromEvent(e: MouseEvent | TouchEvent, prop: keyof Pick<Touch, 'clientX' | 'clientY' | 'screenX' | 'screenY'>, focusClass?: string): number | null;
