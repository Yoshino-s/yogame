"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _root = require("./checks/root.js");

var _root2 = _interopRequireDefault(_root);

var _ast = require("./ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _simplify = require("./ast/simplify.js");

var _simplify2 = _interopRequireDefault(_simplify);

var _getErrors = require("./ast/get-errors.js");

var _getErrors2 = _interopRequireDefault(_getErrors);

var _replaceErrors = require("./ast/replace-errors.js");

var _replaceErrors2 = _interopRequireDefault(_replaceErrors);

var _render = require("./ast/render.js");

var _render2 = _interopRequireDefault(_render);

var _uniqFuncs = require("./ast/uniq-funcs.js");

var _uniqFuncs2 = _interopRequireDefault(_uniqFuncs);

var _util = require("../util.js");

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var gengensym = function gengensym() {
  var g = _util2.default.gengensym();
  return function () {
    return _ast2.default.Var(g.apply(undefined, arguments));
  };
};

// Given a root schema and a shape (map of schemas), returns a string which, if
// run in the body of a function, returns an object of the same shape whose
// values are validators for the schemas.
//
// If no shape is passed, {root} is used.
var generateValidator = function generateValidator(schema) {
  var shape = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { root: schema, };

  var gensym = gengensym();

  var cache = new WeakMap();
  var schemas = [];

  var symbolForSchema = function symbolForSchema(schm) {
    if (!cache.has(schm)) {
      var match = _lodash2.default.find(schemas, function (s) {
        return _lodash2.default.isEqual(s, schm);
      });
      if (match) {
        cache.set(schm, cache.get(match));
      } else {
        cache.set(schm, gensym("f"));
        schemas.push(schm);
      }
    }
    return cache.get(schm);
  };

  var makeContext = function makeContext() {
    return {
      gensym: gengensym(),
      error: function error(subSchema, reason, subreason) {
        return _ast2.default.Error(subSchema, reason, subreason);
      },
      symbolForSchema: symbolForSchema,
      rootSchema: schema,
    };
  };

  var baseSchemas = _lodash2.default.map(shape, function (subSchema) {
    return (0, _root2.default)(subSchema, makeContext());
  });
  var results = _lodash2.default.keyBy(baseSchemas, function (f) {
    return f.name.value;
  });
  var i = 1;
  while (i < schemas.length) {
    var next = (0, _root2.default)(schemas[i], makeContext());
    results[next.name.value] = next;
    i++;
  }

  // TODO: Fix flow unhelpful error
  var simplifiedResults = _lodash2.default.values(results).map(_simplify2.default);

  var schemaObject = _lodash2.default.mapValues(shape, function (subSchema) {
    return symbolForSchema(subSchema);
  });
  var ast = _ast2.default.Body.apply(_ast2.default, _toConsumableArray(simplifiedResults).concat([ _ast2.default.Return(_ast2.default.ObjectLiteral(schemaObject)), ]));
  var nameForSchema = function nameForSchema(subSchema) {
    return _lodash2.default.findKey(shape, function (s) {
      return s === subSchema;
    }) || symbolForSchema(subSchema).value;
  };
  var errors = (0, _getErrors2.default)(ast);
  var replaced = (0, _replaceErrors2.default)(ast, errors, nameForSchema);
  var simplified = (0, _simplify2.default)((0, _uniqFuncs2.default)((0, _simplify2.default)(replaced)));

  var body = (0, _render2.default)(simplified);
  var generated = [ "(function() {", body, "}())", ].join("\n");
  return generated;
};

exports.default = generateValidator;