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

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }
/* eslint-disable no-use-before-define */


var simplifyIf = function simplifyIf(ast) {
  var predicate = simplify(ast.predicate);
  var body = simplify(ast.body);
  var elseBody = simplify(ast.elseBody);
  if (elseBody.type === "empty") {
    if (body.type === "empty") {
      return _ast2.default.Empty;
    } else if (body.type === "body") {
      var _body$body = _toArray(body.body),
        first = _body$body[0],
        rest = _body$body.slice(1);

      if (rest.length === 0 && first.type === "if" && first.elseBody.type === "empty") {
        return simplify(_ast2.default.If(_ast2.default.Binop.And(predicate, first.predicate), first.body, _ast2.default.Empty));
      } else {
        return _ast2.default.If(predicate, body, elseBody);
      }
    } else {
      return _ast2.default.If(predicate, body, elseBody);
    }
  } else {
    return _ast2.default.If(predicate, body, elseBody);
  }
};

var simplifyBody = function simplifyBody(ast) {
  var mapped = _lodash2.default.flatMap(ast.body, function (child) {
    var simplified = simplify(child);
    if (simplified.type === "body") {
      return simplified.body;
    } else if (simplified.type === "empty") {
      return [];
    } else {
      return [ simplified ,];
    }
  });

  var firstReturn = _lodash2.default.findIndex(mapped, function (node) {
    return node.type === "return";
  });
  var body = firstReturn >= 0 ? mapped.slice(0, firstReturn + 1) : mapped;
  if (body.length === 0) {
    return _ast2.default.Empty;
  } else {
    return _ast2.default.Body.apply(_ast2.default, _toConsumableArray(body));
  }
};

var simplifyUnop = function simplifyUnop(ast) {
  var child = ast.child;

  if (ast.op === "!") {
    if (child.type === "binop") {
      var left = simplify(child.left);
      var right = simplify(child.right);
      switch (child.comparator) {
        case "===":
          return _ast2.default.Binop.Neq(left, right);
        case "!==":
          return _ast2.default.Binop.Eq(left, right);
        case "&&":
          return _ast2.default.Binop.Or(simplify(_ast2.default.Unop.Not(left)), simplify(_ast2.default.Unop.Not(right)));
        case "||":
          return _ast2.default.Binop.And(simplify(_ast2.default.Unop.Not(left)), simplify(_ast2.default.Unop.Not(right)));
        case "<":
          return _ast2.default.Binop.Gte(left, right);
        case ">":
          return _ast2.default.Binop.Lte(left, right);
        case "<=":
          return _ast2.default.Binop.Gt(left, right);
        case ">=":
          return _ast2.default.Binop.Lt(left, right);
        default:
          return ast;
      }
    } else if (child.type === "unop" && child.op === "!") {
      return child.child;
    } else {
      return ast;
    }
  } else {
    return ast;
  }
};

var simplify = function simplify(ast) {
  switch (ast.type) {
    case "assignment":
      return _ast2.default.Assignment(ast.variable, simplify(ast.value));
    case "if":
      return simplifyIf(ast);
    case "return":
      return ast;
    case "body":
      return simplifyBody(ast);
    case "for":
      return _ast2.default.For(simplify(ast.init), simplify(ast.condition), simplify(ast.loop), simplify(ast.body));
    case "forin":
      return _ast2.default.ForIn(ast.variable, simplify(ast.iterator), simplify(ast.body));
    case "empty":
      return ast;
    case "function1":
      return _ast2.default.Function1(ast.name, ast.argument, simplify(ast.body));
    case "binop":
      return _ast2.default.Binop.Any(ast.comparator)(simplify(ast.left), simplify(ast.right));
    case "unop":
      return simplifyUnop(ast);
    default:
      return ast;
  }
};

exports.default = simplify;