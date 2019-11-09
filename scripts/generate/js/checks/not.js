"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _macros = require("../ast/macros");

var _macros2 = _interopRequireDefault(_macros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var not = function not(schema, symbol, context) {
  if (schema.not) {
    return _ast2.default.If(_macros2.default.PassedCheck(schema.not, symbol, context), context.error(schema, "not"));
  } else {
    return _ast2.default.Empty;
  }
};
exports.default = not;