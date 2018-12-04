const parser = require("./parser.js")
const file = require("./file.js")

"use strict"

function compileFile(f) {
  const parseResult = parser.parse(file.loadFile(f))
  const typeCheckResult = parseResult.result.typeCheck()
  return {parseResult, typeCheckResult, file: f}
}

function compile(files) {
  return files.map(compileFile)
}

module.exports = {compile}
