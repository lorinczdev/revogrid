/*!
 * Built by Revolist
 */
import reduce from "lodash/reduce";
export const rowDefinitionByType = (newVal = []) => {
  return reduce(newVal, (r, v) => {
    if (!r[v.type]) {
      r[v.type] = {};
    }
    if (v.size) {
      if (!r[v.type].sizes) {
        r[v.type].sizes = {};
      }
      r[v.type].sizes[v.index] = v.size;
    }
    return r;
  }, {});
};
export const rowDefinitionRemoveByType = (oldVal = []) => {
  return reduce(oldVal, (r, v) => {
    if (!r[v.type]) {
      r[v.type] = [];
    }
    if (v.size) {
      r[v.type].push(v.index);
    }
    return r;
  }, {});
};
//# sourceMappingURL=grid.helpers.js.map
