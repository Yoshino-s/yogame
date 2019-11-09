"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});


// Statements
var Function1 = function Function1(name, argument, body) {
  return {
    type: "function1",
    name: name,
    argument: argument,
    body: Body(body),
  };
};
/* eslint-disable no-use-before-define */

var _Binop = function _Binop(comparator) {
  return function (left, right) {
    return {
      type: "binop",
      comparator: comparator,
      left: left,
      right: right,
    };
  };
};
var Assignment = function Assignment(variable, value) {
  return {
    type: "assignment",
    variable: variable,
    value: value,
  };
};
var If = function If(predicate, body) {
  var elseBody = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Empty;

  return {
    type: "if",
    predicate: predicate,
    body: Body(body),
    elseBody: Body(elseBody),
  };
};
var Return = function Return(value) {
  return {
    type: "return",
    value: value,
  };
};
var Body = function Body() {
  for (var _len = arguments.length, body = Array(_len), _key = 0; _key < _len; _key++) {
    body[_key] = arguments[_key];
  }

  if (body.length === 1 && (body[0].type === "body" || body[0].type === "empty")) {
    return body[0];
  } else {
    return { type: "body", body: body, };
  }
};
var For = function For(init, condition, loop, body) {
  return {
    type: "for",
    init: init,
    condition: condition,
    loop: loop,
    body: Body(body),
  };
};
var ForIn = function ForIn(variable, iterator, body) {
  return {
    type: "forin",
    variable: variable,
    iterator: iterator,
    body: Body(body),
  };
};
var Empty = { type: "empty", };
var Var = function Var(value) {
  return { type: "var", value: value, };
};
var Literal = function Literal(value) {
  return { type: "literal", value: value, };
};
var Call0 = function Call0(fn) {
  return {
    type: "call0",
    fn: typeof fn === "string" ? Literal(fn) : fn,
  };
};
var Call1 = function Call1(fn, arg) {
  return {
    type: "call1",
    fn: typeof fn === "string" ? Literal(fn) : fn,
    arg: arg,
  };
};
var Call2 = function Call2(fn, arg1, arg2) {
  return {
    type: "call2",
    fn: typeof fn === "string" ? Literal(fn) : fn,
    arg1: arg1,
    arg2: arg2,
  };
};
var _Unop = function _Unop(op, style) {
  return function (child) {
    return {
      type: "unop",
      child: child,
      op: op,
      style: style,
    };
  };
};
var ObjectLiteral = function ObjectLiteral(object) {
  return {
    type: "objectliteral",
    object: object,
  };
};
var PropertyAccess = function PropertyAccess(obj, property) {
  return {
    type: "propertyaccess",
    obj: obj,
    property: property,
  };
};
var BracketAccess = function BracketAccess(obj, property) {
  return {
    type: "bracketaccess",
    obj: obj,
    property: property,
  };
};
var TypeOf = function TypeOf(child) {
  return {
    type: "typeof",
    child: child,
  };
};
var Comment = function Comment(comment) {
  return { type: "comment", comment: comment, };
};
var Error = function Error(schema, reason, subreason) {
  return {
    type: "error",
    schema: schema,
    reason: reason,
    subreason: subreason,
  };
};

exports.default = {
  Function1: Function1,
  Binop: {
    Eq: _Binop("==="),
    Neq: _Binop("!=="),
    And: _Binop("&&"),
    Or: _Binop("||"),
    Lt: _Binop("<"),
    Gt: _Binop(">"),
    Lte: _Binop("<="),
    Gte: _Binop(">="),
    Div: _Binop("/"),
    Mod: _Binop("%"),
    Any: _Binop,
  },
  Assignment: Assignment,
  If: If,
  Return: Return,
  Body: Body,
  For: For,
  ForIn: ForIn,
  Empty: Empty,
  Var: Var,
  Literal: Literal,
  Call0: Call0,
  Call1: Call1,
  Call2: Call2,
  Unop: {
    Not: _Unop("!", "prefix"),
    Incr: _Unop("++", "suffix"),
    Any: _Unop,
  },
  ObjectLiteral: ObjectLiteral,
  PropertyAccess: PropertyAccess,
  BracketAccess: BracketAccess,
  TypeOf: TypeOf,
  Comment: Comment,
  Error: Error,
  Null: Literal("null"),
  Undefined: Literal("undefined"),
  True: Literal("true"),
  False: Literal("false"),
  NumLiteral: function NumLiteral(n) {
    return Literal("" + n);
  },
  StringLiteral: function StringLiteral(s) {
    return Literal("'" + s + "'");
  },
};