"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _macros = require("../ast/macros");

var _macros2 = _interopRequireDefault(_macros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var uniqueItems = function uniqueItems(schema, symbol, context) {
  if (schema.uniqueItems) {
    var obj = context.gensym();
    var i = context.gensym();
    var stringified = context.gensym();
    return _macros2.default.TypeCheck("array", symbol, _ast2.default.Body(_ast2.default.Assignment(obj, _ast2.default.Literal("{}")), _ast2.default.Assignment(i, _ast2.default.NumLiteral(0)), _ast2.default.For(_ast2.default.Empty, _ast2.default.Binop.Lt(i, _ast2.default.PropertyAccess(symbol, "length")), _ast2.default.Unop.Incr(i), _ast2.default.Body(_ast2.default.Assignment(stringified, _ast2.default.Call1("JSON.stringify", _ast2.default.BracketAccess(symbol, i))), _ast2.default.Assignment(_ast2.default.BracketAccess(obj, stringified), _ast2.default.True))), _ast2.default.If(_ast2.default.Binop.Neq(_ast2.default.PropertyAccess(_ast2.default.Call1("Object.keys", obj), "length"), _ast2.default.PropertyAccess(symbol, "length")), context.error(schema, "uniqueItems"))));
  } else {
    return _ast2.default.Empty;
  }
};
exports.default = uniqueItems;