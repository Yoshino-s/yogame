"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _ast = require("./ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _transform = require("./transform.js");

var _transform2 = _interopRequireDefault(_transform);

const _compose = function compose() {
  for (var _len = arguments.length, fns = Array(_len), _key = 0; _key < _len; _key++) {
    fns[_key] = arguments[_key];
  }

  if (fns.length === 0) {
    return function (arg) {
      return arg;
    };
  } else {
    var last = fns[fns.length - 1];
    var rest = fns.slice(0, -1);
    return function () {
      return rest.reduceRight(function (composed, f) {
        return f(composed);
      }, last.apply(undefined, arguments));
    };
  }
};

var _compose2 = _interopRequireDefault(_compose);

var _collect = require("./collect.js");

var _collect2 = _interopRequireDefault(_collect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

// A structure representing a collection of rewrites. If a tuple a->b is in the
// map, it means that references to a can be replaced with references to b.
var simplify = function simplify(replacements) {
  return new Map(_lodash2.default.map(Array.from(replacements.keys()), function (id) {
    var result = id;
    while (replacements.has(result)) {
      result = replacements.get(result);
    }
    return [ id, result, ];
  }));
};

// Creates a Replacements map by replacing functions of the form
//   function f(a) { return g(a); }

var delegateReplacements = function delegateReplacements(fns, nameToId) {
  var entries = _lodash2.default.flatMap(fns, function (ast) {
    var name = ast.name,
      argument = ast.argument,
      body = ast.body;

    if (body.type === "body" && body.body.length === 1) {
      var line = body.body[0];
      if (line.type === "return") {
        if (line.value.type === "call1") {
          var _line$value = line.value,
            fn = _line$value.fn,
            arg = _line$value.arg;

          if (fn.type === "var") {
            if (arg.value === argument.value) {
              return [ [ nameToId[name.value], nameToId[fn.value], ], ];
            }
          }
        }
      }
    }
    return [];
  });
  return simplify(new Map(entries));
};

var _getFuncs = (0, _collect2.default)(function (ast, recur) {
  if (ast.type === "function1") {
    return [ ast, ];
  } else {
    return recur(ast);
  }
});
var getFuncs = function getFuncs(ast) {
  return _lodash2.default.uniq(_getFuncs(ast));
};

// Creates a Replacements map by checking if function bodies are equal
var equalReplacements = function equalReplacements(fns, nameToId) {
  var replacements = new Map();
  fns.forEach(function (ast, id) {
    if (!replacements.has(id)) {
      _lodash2.default.range(id + 1, fns.length).forEach(function (i) {
        if (_lodash2.default.isEqual(fns[i].body, ast.body)) {
          replacements.set(i, id);
        }
      });
    }
  });
  return simplify(replacements);
};

var replace = function replace(replacer) {
  return function (base) {
    var fns = getFuncs(base);
    var nameToId = _lodash2.default.fromPairs(_lodash2.default.map(fns, function (f, i) {
      return [ f.name.value, i, ];
    }));
    var mapping = replacer(fns, nameToId);

    var t = (0, _transform2.default)(function (ast, recur) {
      if (ast.type === "var") {
        var id = nameToId[ast.value];
        if (mapping.has(id)) {
          var replacedId = mapping.get(id);
          return fns[replacedId].name;
        } else {
          return recur(ast);
        }
      } else if (ast.type === "function1") {
        var _id = nameToId[ast.name.value];
        if (mapping.has(_id)) {
          return _ast2.default.Empty;
        } else {
          return _ast2.default.Function1(ast.name, ast.argument, recur(ast.body));
        }
      } else {
        return recur(ast);
      }
    });

    return t(base);
  };
};

var uniqFuncs = (0, _compose2.default)(replace(delegateReplacements), replace(equalReplacements));

exports.default = uniqFuncs;