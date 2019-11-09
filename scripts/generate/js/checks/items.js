"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _macros = require("../ast/macros");

var _macros2 = _interopRequireDefault(_macros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _additionalItems = function _additionalItems(schema, items, symbol, context) {
  var additionalItems = schema.additionalItems;

  var error = context.error(schema, "additionalItems");
  if (additionalItems === false) {
    return _ast2.default.If(_ast2.default.Binop.Gt(_ast2.default.PropertyAccess(symbol, "length"), _ast2.default.NumLiteral(items.length)), error);
  } else if (additionalItems && (typeof additionalItems === "undefined" ? "undefined" : _typeof(additionalItems)) === "object") {
    var i = context.gensym();
    return _ast2.default.Body(_ast2.default.Assignment(i, _ast2.default.NumLiteral(items.length)), _ast2.default.For(_ast2.default.Empty, _ast2.default.Binop.Lt(i, _ast2.default.PropertyAccess(symbol, "length")), _ast2.default.Unop.Incr(i), _ast2.default.If(_macros2.default.FailedCheck(additionalItems, _ast2.default.BracketAccess(symbol, i), context), error)));
  } else {
    return _ast2.default.Empty;
  }
};

var _items = function _items(schema, symbol, context) {
  var items = schema.items;

  if (Array.isArray(items)) {
    // Tuple. Handle each item individually.
    var additionalCheck = _additionalItems(schema, items, symbol, context);
    var checks = _lodash2.default.map(items, function (subSchema, i) {
      return _ast2.default.If(_ast2.default.Binop.Lt(_ast2.default.NumLiteral(i), _ast2.default.PropertyAccess(symbol, "length")), _ast2.default.If(_macros2.default.FailedCheck(subSchema, _ast2.default.BracketAccess(symbol, _ast2.default.NumLiteral(i)), context), context.error(schema, `items[${ i }]`)));
    });
    return _ast2.default.Body.apply(_ast2.default, [ additionalCheck, ].concat(_toConsumableArray(checks)));
  } else if (items) {
    var counter = context.gensym();
    var check = _ast2.default.Body(_ast2.default.Assignment(counter, _ast2.default.NumLiteral(0)), _ast2.default.For(_ast2.default.Empty, _ast2.default.Binop.Lt(counter, _ast2.default.PropertyAccess(symbol, "length")), _ast2.default.Unop.Incr(counter), _ast2.default.If(_macros2.default.FailedCheck(items, _ast2.default.BracketAccess(symbol, counter), context), context.error(schema, "items"))));
    return _macros2.default.TypeCheck("array", symbol, check);
  } else {
    return _ast2.default.Empty;
  }
};

exports.default = _items;