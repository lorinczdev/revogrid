/*!
 * Built by Revolist
 */
const asciiFirstLetter = 65;
const lettersCount = 26;
export function generateHeader(index) {
  let div = index + 1;
  let label = '';
  let pos;
  while (div > 0) {
    pos = (div - 1) % lettersCount;
    label = String.fromCharCode(asciiFirstLetter + pos) + label;
    div = parseInt(((div - pos) / lettersCount).toString(), 10);
  }
  return label;
}
export function generateHeaderByCount(colsNumber) {
  const rowData = [];
  for (let j = 0; j < colsNumber; j++) {
    rowData.push(generateHeader(j));
  }
  return rowData;
}
//# sourceMappingURL=generateAlphabetHeader.js.map
