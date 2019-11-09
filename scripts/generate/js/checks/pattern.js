"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _macros = require("../ast/macros");

var _macros2 = _interopRequireDefault(_macros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var _pattern = function _pattern(schema, symbol, context) {
  var pattern = schema.pattern;

  if (pattern) {
    var check = _ast2.default.If(_ast2.default.Unop.Not(_ast2.default.Call1(_ast2.default.PropertyAccess(symbol, "match"), _ast2.default.Literal(`/${ pattern }/`))), context.error(schema, "pattern"));
    return _macros2.default.TypeCheck("string", symbol, check);
  } else {
    return _ast2.default.Empty;
  }
};
exports.default = _pattern;