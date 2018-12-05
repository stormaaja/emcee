const parser = require("./parser.js")
const file = require("./file.js")
const {Map} = require("immutable")

"use strict"

function compileFile(f) {
  try {
    const parseResult = parser.parse(file.loadFile(f))
    const typeCheckResult = parseResult.success ?
          parseResult.result.typeCheck() : Map()
    return {parseResult, typeCheckResult, file: f}
  } catch(e) {
    console.error("Error while processing file: " + f)
    throw e
  }
}

function compile(files) {
  return files.map(compileFile)
}

module.exports = {compile}
