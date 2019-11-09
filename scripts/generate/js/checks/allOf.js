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

var allOf = function allOf(schema, symbol, context) {
  if (schema.allOf) {
    var checkResult = context.gensym();
    var nodes = _lodash2.default.map(schema.allOf, function (subSchema) {
      return _ast2.default.Body(_ast2.default.Assignment(checkResult, _macros2.default.Check(subSchema, symbol, context)), _ast2.default.If(_macros2.default.IsError(checkResult), context.error(schema, "allOf", checkResult)));
    });
    return _ast2.default.Body.apply(_ast2.default, _toConsumableArray(nodes));
  } else {
    return _ast2.default.Empty;
  }
};

exports.default = allOf;