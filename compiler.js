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

function main(argv) {
  if (argv.length < 3) {
    console.log("No source file given")
    return 1
  }

  const args = argv.slice(2)
  const files = args.filter(f => !f.startsWith("--"))
  const options = args.filter(f => f.startsWith("--"))

  const printTree = options.includes("--print-tree")

  const results = compile(files)

  results.forEach(r => {
    if (r.success) {
      console.log("%s: \x1b[32mOK\x1b[0m", r.file)
      if (printTree) {
        console.log(JSON.stringify(r.result, null, 2))
      }
    } else {
      console.log("%s: \x1b[31mFail\x1b[0m", r.file)
      console.log(r.result.message)
    }
  })
  return 0
}

main(process.argv)