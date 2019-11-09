"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _allOf = require("./allOf.js");

var _allOf2 = _interopRequireDefault(_allOf);

var _anyOf = require("./anyOf.js");

var _anyOf2 = _interopRequireDefault(_anyOf);

var _dependencies = require("./dependencies.js");

var _dependencies2 = _interopRequireDefault(_dependencies);

var _enum2 = require("./enum.js");

var _enum3 = _interopRequireDefault(_enum2);

var _items = require("./items.js");

var _items2 = _interopRequireDefault(_items);

var _comparisons = require("./comparisons.js");

var _comparisons2 = _interopRequireDefault(_comparisons);

var _multipleOf = require("./multipleOf.js");

var _multipleOf2 = _interopRequireDefault(_multipleOf);

var _not = require("./not.js");

var _not2 = _interopRequireDefault(_not);

var _oneOf = require("./oneOf.js");

var _oneOf2 = _interopRequireDefault(_oneOf);

var _pattern = require("./pattern.js");

var _pattern2 = _interopRequireDefault(_pattern);

var _properties = require("./properties.js");

var _properties2 = _interopRequireDefault(_properties);

var _ref = require("./ref.js");

var _ref2 = _interopRequireDefault(_ref);

var _type = require("./type.js");

var _type2 = _interopRequireDefault(_type);

var _uniqueItems = require("./uniqueItems.js");

var _uniqueItems2 = _interopRequireDefault(_uniqueItems);

var _ast = require("../ast/ast.js");

var _ast2 = _interopRequireDefault(_ast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var root = function root(schema, context) {
  var fnSym = context.symbolForSchema(schema);
  var symbol = context.gensym();

  var body = _ast2.default.Body(
  // $ref needs to be first because it ignores everything else
    (0, _ref2.default)(schema, symbol, context), (0, _allOf2.default)(schema, symbol, context), (0, _anyOf2.default)(schema, symbol, context), (0, _dependencies2.default)(schema, symbol, context), (0, _enum3.default)(schema, symbol, context), (0, _items2.default)(schema, symbol, context), (0, _comparisons2.default)(schema, symbol, context), (0, _multipleOf2.default)(schema, symbol, context), (0, _not2.default)(schema, symbol, context), (0, _oneOf2.default)(schema, symbol, context), (0, _pattern2.default)(schema, symbol, context), (0, _properties2.default)(schema, symbol, context), (0, _type2.default)(schema, symbol, context), (0, _uniqueItems2.default)(schema, symbol, context));

  return _ast2.default.Function1(fnSym, symbol, _ast2.default.Body(body, _ast2.default.Return(_ast2.default.NumLiteral(0))));
};
exports.default = root;