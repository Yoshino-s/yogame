"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _getVars = require("./get-vars.js");

var _getVars2 = _interopRequireDefault(_getVars);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
/* eslint-disable no-use-before-define */


var renderIf = function renderIf(ast) {
  var predicate = ast.predicate,
    body = ast.body,
    elseBody = ast.elseBody;


  var elseString = render(elseBody);
  var elseLines = elseString ? [ "} else {", elseString ,] : [];
  return [ "if (" + render(predicate) + ") {", render(body) ,].concat(elseLines, [ "}" ,]).join("\n");
};

var renderFor = function renderFor(ast) {
  var init = ast.init,
    condition = ast.condition,
    loop = ast.loop,
    body = ast.body;

  return [ "for (" + render(init) + "; " + render(condition) + "; " + render(loop) + ") {", render(body), "}" ,].join("\n");
};

var renderForIn = function renderForIn(ast) {
  var variable = ast.variable,
    iterator = ast.iterator,
    body = ast.body;

  return [ "for (var " + render(variable) + " in " + render(iterator) + ") {", render(body), "}" ,].join("\n");
};

var renderFunction = function renderFunction(ast) {
  var name = ast.name,
    argument = ast.argument,
    body = ast.body;

  var vars = (0, _getVars2.default)(body);
  var varLines = vars.length === 0 ? [] : [ "var " + vars.join(", ") + ";" ,];
  return [ "function " + render(name) + "(" + render(argument) + ") {" ,].concat(varLines, [ render(body), "}" ,]).join("\n");
};

var renderUnop = function renderUnop(ast) {
  var child = "(" + render(ast.child) + ")";
  if (ast.style === "prefix") {
    return "" + ast.op + child;
  } else {
    return "" + child + ast.op;
  }
};

var renderObjectLiteral = function renderObjectLiteral(ast) {
  var object = ast.object;

  var lines = _lodash2.default.map(object, function (value, key) {
    var valueString = render(value);
    return `${key  }: ${  valueString.trimLeft()  },`;
  });
  return [ "{" ,].concat(_toConsumableArray(lines), [ "}" ,]).join("\n");
};

var STATEMENTS_WITH_SEMIS = [ "assignment", "return", "binop", "call0", "call1", "call2", "unop" ,];

var render = function render(ast) {
  switch (ast.type) {
    case "assignment":
      return `${render(ast.variable)  } = ${  render(ast.value)}`;
    case "if":
      return renderIf(ast);
    case "return":
      return "return " + render(ast.value).trimLeft();
    case "body":
      return _lodash2.default.map(ast.body, function (s) {
        var suffix = _lodash2.default.includes(STATEMENTS_WITH_SEMIS, s.type) ? ";" : "";
        var line = render(s);
        return "" + line + suffix;
      }).join("\n");
    case "for":
      return renderFor(ast);
    case "forin":
      return renderForIn(ast);
    case "empty":
      return "";
    case "function1":
      return renderFunction(ast);
    case "binop":
      return `${render(ast.left)  } ${  ast.comparator  } ${  render(ast.right)}`;
    case "var":
      return ast.value;
    case "literal":
      return ast.value;
    case "call0":
      return `${render(ast.fn)  }()`;
    case "call1":
      return `${render(ast.fn)  }(${  render(ast.arg)  })`;
    case "call2":
      return `${render(ast.fn)  }(${  render(ast.arg1)  }, ${  render(ast.arg2)  })`;
    case "unop":
      return renderUnop(ast);
    case "objectliteral":
      return renderObjectLiteral(ast);
    case "propertyaccess":
      return `${render(ast.obj)  }.${  ast.property}`;
    case "bracketaccess":
      return `${render(ast.obj)  }[${  render(ast.property)  }]`;
    case "typeof":
      return "typeof " + render(ast.child);
    case "comment":
      return "/* " + ast.comment + " */";
    case "error":
      return "";
    default:
      throw new Error("Unexpected AST: " + ast);
  }
};

exports.default = render;