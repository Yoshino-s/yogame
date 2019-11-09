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

var dependencies = function dependencies(schema, symbol, context) {
  if (schema.dependencies) {
    var checks = _lodash2.default.map(schema.dependencies, function (check, key) {
      var error = context.error(schema, "dependencies[" + key + "]");
      if (typeof check === "string") {
        return _ast2.default.If(_ast2.default.Binop.And(_ast2.default.Binop.Neq(_ast2.default.PropertyAccess(symbol, key), _ast2.default.Undefined), _ast2.default.Binop.Eq(_ast2.default.PropertyAccess(symbol, check), _ast2.default.Undefined)), error);
      } else if (Array.isArray(check)) {
        var ifs = check.map(function (k) {
          return _ast2.default.If(_ast2.default.Binop.Eq(_ast2.default.PropertyAccess(symbol, k), _ast2.default.Undefined), error);
        });
        return _ast2.default.If(_ast2.default.Binop.Neq(_ast2.default.PropertyAccess(symbol, key), _ast2.default.Undefined), _ast2.default.Body.apply(_ast2.default, _toConsumableArray(ifs)));
      } else {
        return _ast2.default.If(_ast2.default.Binop.Neq(_ast2.default.PropertyAccess(symbol, key), _ast2.default.Undefined), _ast2.default.If(_macros2.default.FailedCheck(check, symbol, context), error));
      }
    });
    return _macros2.default.TypeCheck("object", symbol, _ast2.default.Body.apply(_ast2.default, _toConsumableArray(checks)));
  } else {
    return _ast2.default.Empty;
  }
};

exports.default = dependencies;