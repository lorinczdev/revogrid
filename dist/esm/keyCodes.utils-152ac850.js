/*!
 * Built by Revolist
 */
import './debounce-48584128.js';
import './index-a937c03b.js';

var codes;
(function (codes) {
  codes[codes["MOUSE_LEFT"] = 1] = "MOUSE_LEFT";
  codes[codes["MOUSE_RIGHT"] = 3] = "MOUSE_RIGHT";
  codes[codes["MOUSE_MIDDLE"] = 2] = "MOUSE_MIDDLE";
  codes[codes["BACKSPACE"] = 8] = "BACKSPACE";
  codes[codes["COMMA"] = 188] = "COMMA";
  codes[codes["INSERT"] = 45] = "INSERT";
  codes[codes["DELETE"] = 46] = "DELETE";
  codes[codes["END"] = 35] = "END";
  codes[codes["ENTER"] = 13] = "ENTER";
  codes[codes["ESCAPE"] = 27] = "ESCAPE";
  codes[codes["CONTROL"] = 17] = "CONTROL";
  codes[codes["COMMAND_LEFT"] = 91] = "COMMAND_LEFT";
  codes[codes["COMMAND_RIGHT"] = 93] = "COMMAND_RIGHT";
  codes[codes["COMMAND_FIREFOX"] = 224] = "COMMAND_FIREFOX";
  codes[codes["ALT"] = 18] = "ALT";
  codes[codes["HOME"] = 36] = "HOME";
  codes[codes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
  codes[codes["PAGE_UP"] = 33] = "PAGE_UP";
  codes[codes["PERIOD"] = 190] = "PERIOD";
  codes[codes["SPACE"] = 32] = "SPACE";
  codes[codes["SHIFT"] = 16] = "SHIFT";
  codes[codes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
  codes[codes["TAB"] = 9] = "TAB";
  codes[codes["ARROW_RIGHT"] = 39] = "ARROW_RIGHT";
  codes[codes["ARROW_LEFT"] = 37] = "ARROW_LEFT";
  codes[codes["ARROW_UP"] = 38] = "ARROW_UP";
  codes[codes["ARROW_DOWN"] = 40] = "ARROW_DOWN";
  codes[codes["F1"] = 112] = "F1";
  codes[codes["F2"] = 113] = "F2";
  codes[codes["F3"] = 114] = "F3";
  codes[codes["F4"] = 115] = "F4";
  codes[codes["F5"] = 116] = "F5";
  codes[codes["F6"] = 117] = "F6";
  codes[codes["F7"] = 118] = "F7";
  codes[codes["F8"] = 119] = "F8";
  codes[codes["F9"] = 120] = "F9";
  codes[codes["F10"] = 121] = "F10";
  codes[codes["F11"] = 122] = "F11";
  codes[codes["F12"] = 123] = "F12";
  codes[codes["A"] = 65] = "A";
  codes[codes["C"] = 67] = "C";
  codes[codes["D"] = 68] = "D";
  codes[codes["F"] = 70] = "F";
  codes[codes["L"] = 76] = "L";
  codes[codes["O"] = 79] = "O";
  codes[codes["P"] = 80] = "P";
  codes[codes["S"] = 83] = "S";
  codes[codes["V"] = 86] = "V";
  codes[codes["X"] = 88] = "X";
})(codes || (codes = {}));
var codesLetter;
(function (codesLetter) {
  codesLetter["ENTER"] = "Enter";
  codesLetter["ENTER_NUM"] = "NumpadEnter";
  codesLetter["A"] = "KeyA";
  codesLetter["C"] = "KeyC";
  codesLetter["X"] = "KeyX";
  codesLetter["V"] = "KeyV";
  codesLetter["ESCAPE"] = "Escape";
  codesLetter["TAB"] = "Tab";
  codesLetter["BACKSPACE"] = "Backspace";
  codesLetter["DELETE"] = "Delete";
  codesLetter["ARROW_RIGHT"] = "ArrowRight";
  codesLetter["ARROW_LEFT"] = "ArrowLeft";
  codesLetter["ARROW_UP"] = "ArrowUp";
  codesLetter["ARROW_DOWN"] = "ArrowDown";
  codesLetter["SHIFT"] = "Shift";
})(codesLetter || (codesLetter = {}));

var osPlatform;
(function (osPlatform) {
  osPlatform["mac"] = "Mac";
})(osPlatform || (osPlatform = {}));

function isLetterKey(code) {
  return (code === 32 || // space
    (code >= 48 && code <= 57) ||
    (code >= 96 && code <= 111) ||
    (code >= 186 && code <= 192) ||
    (code >= 219 && code <= 222) ||
    code >= 226 ||
    (code >= 65 && code <= 90)); // a-z
}
function isClear(code) {
  return codesLetter.BACKSPACE === code || codesLetter.DELETE === code;
}
function isTab(code) {
  return codesLetter.TAB === code;
}
function isEnterKey(code) {
  return code === codesLetter.ENTER || code === codesLetter.ENTER_NUM;
}
function isCut(event) {
  return (event.ctrlKey && event.key === 'x') || // Ctrl + X on Windows
    (event.metaKey && event.key === 'x'); // Cmd + X on Mac
}
function isCopy(event) {
  return (event.ctrlKey && event.key === 'c') || // Ctrl + C on Windows
    (event.metaKey && event.key === 'c'); // Cmd + C on Mac
}
function isPaste(event) {
  return (event.ctrlKey && event.key === 'v') || // Ctrl + V on Windows
    (event.metaKey && event.key === 'v'); // Cmd + V on Mac
}
function isAll(event) {
  return (event.ctrlKey && event.key === 'a') || // Ctrl + A on Windows
    (event.metaKey && event.key === 'a'); // Cmd + A on Mac
}

export { isEnterKey as a, isCopy as b, codesLetter as c, isCut as d, isPaste as e, isAll as f, isLetterKey as g, isTab as h, isClear as i };

//# sourceMappingURL=keyCodes.utils-152ac850.js.map