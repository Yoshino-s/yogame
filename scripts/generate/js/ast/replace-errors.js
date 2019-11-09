"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var _ast = require("./ast.js");

var _ast2 = _interopRequireDefault(_ast);

var _transform = require("./transform.js");

var _transform2 = _interopRequireDefault(_transform);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj, }; }

var replaceErrors = function replaceErrors(root, errors, nameForSchema) {
  var id = 1;
  var cache = {};
  var t = (0, _transform2.default)(function (ast, recur) {
    if (ast.type === "error") {
      var _schema = ast.schema,
        reason = ast.reason,
        subreason = ast.subreason;

      var message = `${nameForSchema(_schema)  }: ${  reason}`;
      if (!cache.hasOwnProperty(message)) {
        cache[message] = id++;
      }
      if (subreason) {
        return _ast2.default.Body(_ast2.default.Comment(message), _ast2.default.Return(_ast2.default.Call1(_ast2.default.PropertyAccess(subreason, "concat"), _ast2.default.NumLiteral(cache[message]))));
      } else {
        // Lazy!
        return _ast2.default.Body(_ast2.default.Comment(message), _ast2.default.Return(_ast2.default.BracketAccess(_ast2.default.Empty, _ast2.default.NumLiteral(cache[message]))));
      }
    } else {
      return recur(ast);
    }
  });
  return t(root);
};

exports.default = replaceErrors;