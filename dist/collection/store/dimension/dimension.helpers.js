/*!
 * Built by Revolist
 */
import each from "lodash/each";
import sortedIndex from "lodash/sortedIndex";
import reduce from "lodash/reduce";
/**
 * Pre-calculation
 * Dimension custom sizes for each cell
 * Keeps only changed sizes, skips origin size
 */
export function calculateDimensionData(originItemSize, newSizes = {}) {
  const positionIndexes = [];
  const positionIndexToItem = {};
  const indexToItem = {};
  // combine all new sizes
  const sizes = Object.assign({}, newSizes);
  // prepare order sorted new sizes and calculate changed real size
  let newIndexes = [];
  each(newSizes, (_, i) => {
    const index = parseInt(i, 10);
    newIndexes[sortedIndex(newIndexes, index)] = index;
  });
  // fill new coordinates based on what is changed
  reduce(newIndexes, (previous, itemIndex, i) => {
    const newItem = {
      itemIndex,
      start: 0,
      end: 0,
    };
    // if previous item was changed too
    if (previous) {
      const itemsBetween = (itemIndex - previous.itemIndex - 1) * originItemSize;
      newItem.start = itemsBetween + previous.end;
    }
    else {
      newItem.start = itemIndex * originItemSize;
    }
    newItem.end = newItem.start + sizes[itemIndex];
    positionIndexes.push(newItem.start);
    indexToItem[itemIndex] = positionIndexToItem[i] = newItem;
    return newItem;
  }, undefined);
  return {
    indexes: newIndexes,
    positionIndexes: [...positionIndexes],
    positionIndexToItem: Object.assign({}, positionIndexToItem),
    indexToItem,
    sizes,
  };
}
/**
 * Calculate item by position
 */
export function getItemByPosition({ indexes, positionIndexes, originItemSize, positionIndexToItem }, pos) {
  const item = {
    itemIndex: 0,
    start: 0,
    end: 0,
  };
  const currentPlace = indexes.length ? sortedIndex(positionIndexes, pos) : 0;
  // not found or first index
  if (!currentPlace) {
    item.itemIndex = Math.floor(pos / originItemSize);
    item.start = item.itemIndex * originItemSize;
    item.end = item.start + originItemSize;
    return item;
  }
  const positionItem = positionIndexToItem[currentPlace - 1];
  // if item has specified size
  if (positionItem.end > pos) {
    return positionItem;
  }
  // special size item was present before
  const relativePos = pos - positionItem.end;
  const relativeIndex = Math.floor(relativePos / originItemSize);
  item.itemIndex = positionItem.itemIndex + 1 + relativeIndex;
  item.start = positionItem.end + relativeIndex * originItemSize;
  item.end = item.start + originItemSize;
  return item;
}
export function getItemByIndex(dimension, index) {
  let item = {
    itemIndex: index,
    start: 0,
    end: 0,
  };
  // if item has specified size
  if (dimension.indexToItem[index]) {
    return dimension.indexToItem[index];
  }
  const currentPlace = dimension.indexes.length ? sortedIndex(dimension.indexes, index) : 0;
  // not found or first index
  if (!currentPlace) {
    item.start = item.itemIndex * dimension.originItemSize;
    item.end = item.start + dimension.originItemSize;
    return item;
  }
  // special size item was present before
  const positionItem = dimension.indexToItem[dimension.indexes[currentPlace - 1]];
  item.start = positionItem.end + (index - positionItem.itemIndex - 1) * dimension.originItemSize;
  item.end = item.start + dimension.originItemSize;
  return item;
}
//# sourceMappingURL=dimension.helpers.js.map
