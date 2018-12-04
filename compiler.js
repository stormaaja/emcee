const parser = require("./parser.js")
const file = require("./file.js")

"use strict"

function compile(files) {
  const parseResult = files.map(
    (f) => {
      return Object.assign(
        parser.parse(file.loadFile(f)),
        {file: f})
    }
  )
  return parseResult
}
