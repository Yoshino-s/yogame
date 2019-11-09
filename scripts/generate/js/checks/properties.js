"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _macros = require("../ast/macros");

var _macros2 = _interopRequireDefault(_macros);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var additionalPropertiesCheck = function additionalPropertiesCheck(schema, symbol, context) {
  var additionalProperties = schema.additionalProperties;

  if (additionalProperties === false) {
    return context.error(schema, "additionalProperties");
  } else if (additionalProperties && (typeof additionalProperties === "undefined" ? "undefined" : _typeof(additionalProperties)) === "object") {
    var checkResult = context.gensym();
    return _ast2.default.Body(_ast2.default.Assignment(checkResult, _macros2.default.Check(additionalProperties, symbol, context)), _ast2.default.If(_macros2.default.IsError(checkResult), context.error(schema, "additionalProperties", checkResult)));
  } else {
    return _ast2.default.Empty;
  }
};

var additionalChecks = function additionalChecks(schema, properties, patternProperties, additionalProperties, keySym, valSym, context) {
  // This generates a block of code like
  //   if (key === "key1" && error(check1(data))) { (error) }
  //   if (key === "key2" && error(check2(data))) { (error) }
  //   if (key.match(/pattern3/) && error(check3(data))) { (error) }
  //   if (key.match(/pattern4/) && error(check4(data))) { (error) }
  //   if (!hit && error(additionalCheck(data))) { (error) }
  var propertyChecks = _lodash2.default.map(properties, function (subSchema, key) {
    return {
      predicate: _ast2.default.Binop.Eq(keySym, _ast2.default.StringLiteral(key)),
      subSchema: subSchema,
      message: `properties[${ key }]`,
    };
  });
  var patternChecks = _lodash2.default.map(patternProperties, function (subSchema, pattern) {
    return {
      predicate: _ast2.default.Call1(_ast2.default.PropertyAccess(keySym, "match"), _ast2.default.Literal(`/${ pattern }/`)),
      subSchema: subSchema,
      message: `properties[${ pattern }]`,
    };
  });
  var allChecks = [].concat(_toConsumableArray(propertyChecks), _toConsumableArray(patternChecks));
  // Two cases where we don't need a hit counter:
  //   - There are no additionalProperties or patternProperties
  //   - There are no properties
  if (allChecks.length === 0 || additionalProperties === undefined || additionalProperties === true) {
    var checkResult = context.gensym();
    var checks = _lodash2.default.map(allChecks, function (_ref) {
      var predicate = _ref.predicate,
        subSchema = _ref.subSchema,
        message = _ref.message;

      return _ast2.default.If(predicate, _ast2.default.Body(_ast2.default.Assignment(checkResult, _macros2.default.Check(subSchema, valSym, context)), _ast2.default.If(_macros2.default.IsError(checkResult), context.error(schema, message, checkResult))));
    });
    return _ast2.default.Body.apply(_ast2.default, _toConsumableArray(checks).concat([ additionalPropertiesCheck(schema, valSym, context), ]));
  } else {
    var _checkResult = context.gensym();
    var hitSym = context.gensym();
    var _checks = _lodash2.default.map(allChecks, function (_ref2) {
      var predicate = _ref2.predicate,
        subSchema = _ref2.subSchema,
        message = _ref2.message;

      return _ast2.default.Body(_ast2.default.If(predicate, _ast2.default.Body(_ast2.default.Assignment(_checkResult, _macros2.default.Check(subSchema, valSym, context)), _ast2.default.If(_macros2.default.IsError(_checkResult), context.error(schema, message, _checkResult), _ast2.default.Assignment(hitSym, _ast2.default.True)))));
    });
    return _ast2.default.Body.apply(_ast2.default, [ _ast2.default.Assignment(hitSym, _ast2.default.False), ].concat(_toConsumableArray(_checks), [ _ast2.default.If(_ast2.default.Binop.Eq(hitSym, _ast2.default.False), additionalPropertiesCheck(schema, valSym, context)), ]));
  }
};

var _properties = function _properties(schema, symbol, context) {
  var properties = schema.properties,
    required = schema.required,
    patternProperties = schema.patternProperties,
    additionalProperties = schema.additionalProperties;

  if (!patternProperties && (additionalProperties === undefined || additionalProperties === true)) {
    // Static list of properties to check
    var checkResult = context.gensym();
    var sym = context.gensym();
    var checks = _ast2.default.Body.apply(_ast2.default, _toConsumableArray(_lodash2.default.flatMap(properties, function (subSchema, key) {
      var isRequired = _lodash2.default.includes(required, key);
      return _ast2.default.Body(_ast2.default.Assignment(sym, _ast2.default.PropertyAccess(symbol, key)), _ast2.default.If(_ast2.default.Binop.Neq(sym, _ast2.default.Undefined), _ast2.default.Body(_ast2.default.Assignment(checkResult, _macros2.default.Check(subSchema, sym, context)), _ast2.default.If(_macros2.default.IsError(checkResult), context.error(schema, `properties[${ key }]`, checkResult))), isRequired ? context.error(schema, `required[${ key }]`) : _ast2.default.Empty));
    })));
    return _macros2.default.TypeCheck("object", symbol, checks);
  } else {
    // Need to loop through all properties to check. We'll generate a loop:
    //   for (var key in json) {
    //     var val = json[key];
    //     var hit = false;
    //     if (key === property1) { ... }
    //     if (key === property2) { ... }
    //     if (key.match(pattern1)) { ... }
    //     if (key.match(pattern2)) { ... }
    //     if (!hit) { ... }
    //   }
    var keySym = context.gensym();
    var valSym = context.gensym();

    var loop = _ast2.default.ForIn(keySym, symbol, _ast2.default.Body(_ast2.default.Assignment(valSym, _ast2.default.BracketAccess(symbol, keySym)), additionalChecks(schema, properties, patternProperties, additionalProperties, keySym, valSym, context)));
    var requiredChecks = _lodash2.default.map(required, function (property) {
      return _ast2.default.If(_ast2.default.Binop.Eq(_ast2.default.PropertyAccess(symbol, property), _ast2.default.Undefined), context.error(schema, `required[${ property }]`));
    });
    return _macros2.default.TypeCheck("object", symbol, _ast2.default.Body.apply(_ast2.default, [ loop, ].concat(_toConsumableArray(requiredChecks))));
  }
};

exports.default = _properties;