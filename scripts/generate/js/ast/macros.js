"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _ast = require("./ast.js");

var _ast2 = _interopRequireDefault(_ast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var IsError = function IsError(symbol) {
  return _ast2.default.Binop.Neq(symbol, _ast2.default.NumLiteral(0));
};


var FailedCheck = function FailedCheck(subSchema, symbol, context) {
  var fnSym = context.symbolForSchema(subSchema);
  return IsError(_ast2.default.Call1(fnSym, symbol));
};

var PassedCheck = function PassedCheck(subSchema, symbol, context) {
  return _ast2.default.Unop.Not(FailedCheck(subSchema, symbol, context));
};

var Check = function Check(subSchema, symbol, context) {
  var check = context.symbolForSchema(subSchema);
  return _ast2.default.Call1(check, symbol);
};

var PrimitivePredicate = function PrimitivePredicate(type, symbol) {
  switch (type) {
    case "integer":
      return _ast2.default.Binop.And(_ast2.default.Binop.Eq(_ast2.default.TypeOf(symbol), _ast2.default.StringLiteral("number")), _ast2.default.Binop.Eq(_ast2.default.Binop.Mod(symbol, _ast2.default.NumLiteral(1)), _ast2.default.NumLiteral(0)));
    case "number":
      return _ast2.default.Binop.Eq(_ast2.default.TypeOf(symbol), _ast2.default.StringLiteral("number"));
    case "string":
      return _ast2.default.Binop.Eq(_ast2.default.TypeOf(symbol), _ast2.default.StringLiteral("string"));
    case "object":
      return _ast2.default.Binop.And(symbol, _ast2.default.Binop.And(_ast2.default.Binop.Eq(_ast2.default.TypeOf(symbol), _ast2.default.StringLiteral("object")), _ast2.default.Unop.Not(_ast2.default.Call1("Array.isArray", symbol))));
    case "array":
      return _ast2.default.Call1("Array.isArray", symbol);
    case "boolean":
      return _ast2.default.Binop.Eq(_ast2.default.TypeOf(symbol), _ast2.default.StringLiteral("boolean"));
    case "null":
      return _ast2.default.Binop.Eq(symbol, _ast2.default.Null);
    default:
      return _ast2.default.False;
  }
};

var TypeCheck = function TypeCheck(type, symbol, body) {
  return _ast2.default.If(PrimitivePredicate(type, symbol), body);
};

exports.default = {
  FailedCheck: FailedCheck,
  PassedCheck: PassedCheck,
  IsError: IsError,
  Check: Check,
  PrimitivePredicate: PrimitivePredicate,
  TypeCheck: TypeCheck,
};