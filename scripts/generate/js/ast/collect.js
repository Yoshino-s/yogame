"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
/* eslint-disable no-use-before-define */


var collect = function collect(extractor) {
  var _recur = function _recur(ast) {
    switch (ast.type) {
      case "assignment":
        return recur(ast.value);
      case "if":
        return [].concat(_toConsumableArray(recur(ast.predicate)), _toConsumableArray(recur(ast.body)), _toConsumableArray(recur(ast.elseBody)));
      case "return":
        return recur(ast.value);
      case "body":
        return _lodash2.default.flatMap(ast.body, recur);
      case "for":
        return [].concat(_toConsumableArray(recur(ast.init)), _toConsumableArray(recur(ast.condition)), _toConsumableArray(recur(ast.loop)), _toConsumableArray(recur(ast.body)));
      case "forin":
        return [].concat(_toConsumableArray(recur(ast.iterator)), _toConsumableArray(recur(ast.body)));
      case "empty":
        return [];
      case "function1":
        return [].concat(_toConsumableArray(recur(ast.name)), _toConsumableArray(recur(ast.argument)), _toConsumableArray(recur(ast.body)));
      case "binop":
        return [].concat(_toConsumableArray(recur(ast.left)), _toConsumableArray(recur(ast.right)));
      case "var":
        return [];
      case "literal":
        return [];
      case "call0":
        return recur(ast.fn);
      case "call1":
        return [].concat(_toConsumableArray(recur(ast.fn)), _toConsumableArray(recur(ast.arg)));
      case "call2":
        return [].concat(_toConsumableArray(recur(ast.fn)), _toConsumableArray(recur(ast.arg1)), _toConsumableArray(recur(ast.arg2)));
      case "unop":
        return recur(ast.child);
      case "objectliteral":
        return _lodash2.default.flatMap(ast.object, recur);
      case "propertyaccess":
        return recur(ast.obj);
      case "bracketaccess":
        return [].concat(_toConsumableArray(recur(ast.obj)), _toConsumableArray(recur(ast.property)));
      case "typeof":
        return recur(ast.child);
      case "comment":
      case "error":
        return [];
      default:
        throw new Error("Unexpected AST: " + ast);
    }
  };
  var recur = function recur(ast) {
    return extractor(ast, _recur);
  };
  return recur;
};

exports.default = collect;