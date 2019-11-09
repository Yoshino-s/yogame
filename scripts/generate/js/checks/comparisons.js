"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _macros = require("../ast/macros");

var _macros2 = _interopRequireDefault(_macros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var comparisons = function comparisons(schema, symbol, context) {
  var symbolLength = _ast2.default.PropertyAccess(symbol, "length");
  var keysLength = _ast2.default.PropertyAccess(_ast2.default.Call1("Object.keys", symbol), "length");

  var comparison = function comparison(sym, comparator, field) {
    var base = schema[field];
    if (typeof base === "number") {
      return _ast2.default.If(comparator(sym, _ast2.default.NumLiteral(base)), context.error(schema, field));
    } else {
      return _ast2.default.Empty;
    }
  };

  return _ast2.default.Body(_macros2.default.TypeCheck("number", symbol, _ast2.default.Body(comparison(symbol, schema.exclusiveMinimum ? _ast2.default.Binop.Lte : _ast2.default.Binop.Lt, "minimum"), comparison(symbol, schema.exclusiveMaximum ? _ast2.default.Binop.Gte : _ast2.default.Binop.Gt, "maximum"))), _macros2.default.TypeCheck("string", symbol, _ast2.default.Body(comparison(symbolLength, _ast2.default.Binop.Lt, "minLength"), comparison(symbolLength, _ast2.default.Binop.Gt, "maxLength"))), _macros2.default.TypeCheck("array", symbol, _ast2.default.Body(comparison(symbolLength, _ast2.default.Binop.Lt, "minItems"), comparison(symbolLength, _ast2.default.Binop.Gt, "maxItems"))), _macros2.default.TypeCheck("object", symbol, _ast2.default.Body(comparison(keysLength, _ast2.default.Binop.Lt, "minProperties"), comparison(keysLength, _ast2.default.Binop.Gt, "maxProperties"))));
};
exports.default = comparisons;