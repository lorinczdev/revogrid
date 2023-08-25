/*!
 * Built by Revolist
 */
const LETTER_BLOCK_SIZE = 10;
export const calculateRowHeaderSize = (itemsLength, rowHeaderColumn) => {
  return (rowHeaderColumn === null || rowHeaderColumn === void 0 ? void 0 : rowHeaderColumn.size) || (itemsLength.toString().length + 1) * LETTER_BLOCK_SIZE;
};
//# sourceMappingURL=row-header-utils.js.map
