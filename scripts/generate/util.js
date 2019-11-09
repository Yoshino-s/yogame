"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});

var lodash = require("lodash");

var INDENT = "  ";

var indent = function indent(line, depth) {
  return `${ lodash.default.repeat(INDENT, depth) }${line}`;
};

var gengensym = function gengensym() {
  var cache = {};
  return function () {
    var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "v";

    cache[prefix] = cache[prefix] || 0;
    return `${ prefix }${cache[prefix]++}`;
  };
};

exports.default = {
  indent: indent,
  gengensym: gengensym,
};