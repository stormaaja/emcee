const {compile} = require("./compiler.js")

function main(argv) {
  if (argv.length < 3) {
    console.log("No source file given")
    return 1
  }

  const args = argv.slice(2)
  const files = args.filter(f => !f.startsWith("--"))
  const options = args.filter(f => f.startsWith("--"))

  const objects = options.includes("--objects")
  const printAST = options.includes("--print-ast")
  const debug = options.includes("--debug")
  const evalCode = options.includes("--eval")

  const results = compile(files)

  results.forEach(r => {
    if (debug) {
      console.log(r)
    }

    if (!r.parseResult.success) {
      console.log("%s: \x1b[31mParse failed\x1b[0m", r.file)
      console.log(r.parseResult.result.message)
    } else if (!r.typeCheckResult.get("errors").isEmpty()) {
      console.log("%s: \x1b[31mTypecheck failed\x1b[0m", r.file)
      r.typeCheckResult.get("errors").forEach((e) => {
        const node = e.get("node")
        const info = node.info.toJS()
        const message = node.id ?
          `${node.id} ${e.get("message")}` : e.get("message")
        console.log(
          `${r.file} ${info.first_line}:${info.first_column} ${message}`)
      })
    } else {
      if (printAST) {
        const tree = objects ?
          r.parseResult.result : JSON.stringify(r.parseResult.result, null, 2)
        console.log(tree)
      }
      if (evalCode) {
        console.log(r.parseResult.result.eval())
      } else {
        console.log("%s: \x1b[32mOK\x1b[0m", r.file)
      }
    }
  })
  return 0
}

main(process.argv)
