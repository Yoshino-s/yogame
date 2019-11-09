"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var baseLiteral = function baseLiteral(base) {
  if (typeof base === "number") {
    return _ast2.default.NumLiteral(base);
  } else if (typeof base === "boolean") {
    return base ? _ast2.default.True : _ast2.default.False;
  } else {
    return _ast2.default.StringLiteral(base);
  }
};

var _enum = function _enum(schema, symbol, context) {
  if (schema.enum) {
    var match = context.gensym();
    var checks = _lodash2.default.map(schema.enum, function (value) {
      if (typeof value === "number" || typeof value === "boolean" || typeof value === "string") {
        return _ast2.default.If(_ast2.default.Binop.Eq(symbol, baseLiteral(value)), _ast2.default.Unop.Incr(match));
      } else {
        return _ast2.default.If(_ast2.default.Binop.Eq(_ast2.default.Call1("JSON.stringify", symbol), _ast2.default.StringLiteral(JSON.stringify(value))), _ast2.default.Unop.Incr(match));
      }
    });
    return _ast2.default.Body(_ast2.default.Assignment(match, _ast2.default.NumLiteral(0)), _ast2.default.Body.apply(_ast2.default, _toConsumableArray(checks)), _ast2.default.If(_ast2.default.Binop.Eq(match, _ast2.default.NumLiteral(0)), context.error(schema, "enum")));
  } else {
    return _ast2.default.Empty;
  }
};

exports.default = _enum;