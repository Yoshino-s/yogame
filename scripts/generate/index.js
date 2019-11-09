"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _generatedValidator = require("./generated-validator.js");

var _generatedValidator2 = _interopRequireDefault(_generatedValidator);

var _generate3 = require("./js/generate.js");

var _generate4 = _interopRequireDefault(_generate3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var generate = function generate(anything) {
  var anyShape = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { root: anything, };

  if (_generatedValidator2.default.JsonSchema(anything) !== 0) {
    throw new Error("Invalid schema.");
  } else {
    var schema = anything;
    var shape = anyShape;
    return (0, _generate4.default)(schema, shape);
  }
};

exports.default = generate;