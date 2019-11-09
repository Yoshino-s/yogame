/* eslint-disable */
const path = require("path");
const TJS = require("typescript-json-schema");
const fs = require("fs");
const generate = require("./generate");
const terser = require("terser");

const JSL = require("../src/json-schema/schemaList.json");
const settings = {
  required: true,
};
const compilerOptions = {
  strictNullChecks: true,
};
// optionally pass a base path
const basePath = "./src/json-schema";
JSL.forEach(function (v) {
  const program = TJS.getProgramFromFiles([ path.resolve(basePath, v.tsSource), ], compilerOptions, basePath);
  const schema = TJS.generateSchema(program, v.typeName, settings);
  fs.writeFileSync(path.resolve(basePath, v.output), "/* eslint-disable */export default "+terser.minify(generate.default(schema),{compress:false}).code);
});
