"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _ast = require("./ast.js");

var _ast2 = _interopRequireDefault(_ast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
/* eslint-disable no-use-before-define */


var transform = function transform(partial) {
  var _recur = function _recur(ast) {
    switch (ast.type) {
      case "assignment":
        return _ast2.default.Assignment(recur(ast.variable), recur(ast.value));
      case "if":
        return _ast2.default.If(recur(ast.predicate), recur(ast.body), recur(ast.elseBody));
      case "return":
        return _ast2.default.Return(recur(ast.value));
      case "body":
        return _ast2.default.Body.apply(_ast2.default, _toConsumableArray(_lodash2.default.map(ast.body, recur)));
      case "for":
        return _ast2.default.For(recur(ast.init), recur(ast.condition), recur(ast.loop), recur(ast.body));
      case "forin":
        return _ast2.default.ForIn(recur(ast.variable), recur(ast.iterator), recur(ast.body));
      case "empty":
        return _ast2.default.Empty;
      case "function1":
        return _ast2.default.Function1(recur(ast.name), recur(ast.argument), recur(ast.body));
      case "binop":
        return _ast2.default.Binop.Any(ast.comparator)(recur(ast.left), recur(ast.right));
      case "var":
        return ast;
      case "literal":
        return ast;
      case "call0":
        return _ast2.default.Call0(recur(ast.fn));
      case "call1":
        return _ast2.default.Call1(recur(ast.fn), recur(ast.arg));
      case "call2":
        return _ast2.default.Call2(recur(ast.fn), recur(ast.arg1), recur(ast.arg2));
      case "unop":
        return _ast2.default.Unop.Any(ast.op, ast.style)(recur(ast.child));
      case "objectliteral":
        return _ast2.default.ObjectLiteral(_lodash2.default.mapValues(ast.object, recur));
      case "propertyaccess":
        return _ast2.default.PropertyAccess(recur(ast.obj), ast.property);
      case "bracketaccess":
        return _ast2.default.BracketAccess(recur(ast.obj), recur(ast.property));
      case "typeof":
        return _ast2.default.TypeOf(recur(ast.child));
      case "comment":
        return ast;
      case "error":
        return ast;
      default:
        throw new Error("Unexpected AST: " + ast);
    }
  };
  var recur = function recur(ast) {
    return partial(ast, _recur);
  };
  return recur;
};

exports.default = transform;