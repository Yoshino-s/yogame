"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _macros = require("../ast/macros");

var _macros2 = _interopRequireDefault(_macros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var oneOf = function oneOf(schema, symbol, context) {
  if (schema.oneOf) {
    // var count = 0;
    //
    // if (check1(data) === null) { count++ }
    // if (check2(data) === null) { count++ }
    //
    // if (count !== 1) { (error) }
    var count = context.gensym();
    var checks = _lodash2.default.map(schema.oneOf, function (subSchema) {
      return _ast2.default.If(_macros2.default.PassedCheck(subSchema, symbol, context), _ast2.default.Unop.Incr(count));
    });
    return _ast2.default.Body(_ast2.default.Assignment(count, _ast2.default.NumLiteral(0)), _ast2.default.Body.apply(_ast2.default, _toConsumableArray(checks)), _ast2.default.If(_ast2.default.Binop.Neq(count, _ast2.default.NumLiteral(1)), context.error(schema, "oneOf")));
  } else {
    return _ast2.default.Empty;
  }
};

exports.default = oneOf;