"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _collect = require("./collect.js");

var _collect2 = _interopRequireDefault(_collect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var getErrors = function getErrors(root) {
  var _getErrors = (0, _collect2.default)(function (ast, recur) {
    if (ast.type === "error") {
      var _schema = ast.schema,
        _reason = ast.reason;

      return [ { schema: _schema, reason: _reason, } ,];
    } else {
      return recur(ast);
    }
  });
  return _getErrors(root);
};

exports.default = getErrors;