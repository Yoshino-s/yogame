'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsonPointer = require('json-pointer');

var _jsonPointer2 = _interopRequireDefault(_jsonPointer);

var _ast = require('../ast/ast.js');

var _ast2 = _interopRequireDefault(_ast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ref = function ref(schema, symbol, context) {
  // No ref in json schema json schema...
  var _ref = schema,
      $ref = _ref.$ref;

  if ($ref && typeof $ref === 'string' && $ref.startsWith('#')) {
    var subSchema = _jsonPointer2.default.get(context.rootSchema, decodeURIComponent($ref.substring(1)));
    var fnSym = context.symbolForSchema(subSchema);
    return _ast2.default.Return(_ast2.default.Call1(fnSym, symbol));
  } else {
    return _ast2.default.Empty;
  }
};

exports.default = ref;