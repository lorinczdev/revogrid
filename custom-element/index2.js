/*!
 * Built by Revolist
 */
import './_stringToPath.js';
import './isObject.js';

/* Calculate system scrollbar width */
function getScrollbarWidth(doc) {
  // Creating invisible container
  const outer = doc.createElement('div');
  const styles = outer.style;
  styles.visibility = 'hidden';
  styles.overflow = 'scroll'; // forcing scrollbar to appear
  styles.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  doc.body.appendChild(outer);
  // Creating inner element and placing it in the container
  const inner = doc.createElement('div');
  outer.appendChild(inner);
  // Calculating difference between container's full width and the child width
  const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);
  return scrollbarWidth;
}
/* Scale a value between 2 ranges
 *
 * Sample:
 * // 55 from a 0-100 range to a 0-1000 range (Ranges don't have to be positive)
 * const n = scaleValue(55, [0,100], [0,1000]);
 *
 * Ranges of two values
 * @from
 * @to
 *
 * ~~ return value does the equivalent of Math.floor but faster.
 */
function scaleValue(value, from, to) {
  return ((to[1] - to[0]) * (value - from[0])) / (from[1] - from[0]) + to[0];
}
/**
 * Async timeout
 */
async function timeout(delay = 0) {
  await new Promise((r) => {
    setTimeout(() => r(), delay);
  });
}

export { getScrollbarWidth as g, scaleValue as s, timeout as t };

//# sourceMappingURL=index2.js.map