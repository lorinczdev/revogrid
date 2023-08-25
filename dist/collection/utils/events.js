/*!
 * Built by Revolist
 */
function isTouch(e) {
  return !!e.touches;
}
export function verifyTouchTarget(touchEvent, focusClass) {
  if (focusClass && touchEvent) {
    if (!(touchEvent.target instanceof Element && touchEvent.target.classList.contains(focusClass))) {
      return false;
    }
  }
  return true;
}
export function getFromEvent(e, prop, focusClass // for touch events
) {
  if (isTouch(e)) {
    if (e.touches.length > 0) {
      const touchEvent = e.touches[0];
      if (!verifyTouchTarget(touchEvent, focusClass)) {
        return null;
      }
      return touchEvent[prop] || 0;
    }
    return null;
  }
  return e[prop] || 0;
}
//# sourceMappingURL=events.js.map
