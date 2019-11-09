"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _collect = require("./collect.js");

var _collect2 = _interopRequireDefault(_collect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
/* eslint-disable no-use-before-define */


var _getVars = (0, _collect2.default)(function (ast, recur) {
  if (ast.type === "assignment") {
    if (ast.variable.type === "var") {
      return [ ast.variable.value ,];
    } else {
      return [];
    }
  } else if (ast.type === "forin") {
    return [ ast.variable.value ,].concat(_toConsumableArray(recur(ast.body)));
  } else if (ast.type === "function1") {
    return [];
  } else {
    return recur(ast);
  }
});

var getVars = function getVars(ast) {
  return _lodash2.default.uniq(_getVars(ast));
};
exports.default = getVars;