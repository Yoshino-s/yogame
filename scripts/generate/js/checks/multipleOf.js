"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _macros = require("../ast/macros");

var _macros2 = _interopRequireDefault(_macros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var _multipleOf = function _multipleOf(schema, symbol, context) {
  var multipleOf = schema.multipleOf;

  if (multipleOf) {
    var divided = context.gensym();
    return _macros2.default.TypeCheck("number", symbol, _ast2.default.Body(_ast2.default.Assignment(divided, _ast2.default.Binop.Div(symbol, _ast2.default.NumLiteral(multipleOf))), _ast2.default.If(_ast2.default.Unop.Not(_macros2.default.PrimitivePredicate("integer", divided)), context.error(schema, "multipleOf"))));
  } else {
    return _ast2.default.Empty;
  }
};
exports.default = _multipleOf;