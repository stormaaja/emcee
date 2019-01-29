const fs = require("fs")
const path = require("path")

"use strict"

function loadFile(filePath) {
  const file = path.normalize(filePath)
  const source = fs.readFileSync(file, "utf8")
  return source
}

module.exports = {loadFile}
