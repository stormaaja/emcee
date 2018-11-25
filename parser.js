const jison = require("jison")
const file = require("./file.js")

"use strict"

const bnf = file.loadFile("emcee.jison")

function parseSource(parser, source) {
  try {
    return {success: true, result: parser.parse(source)}
  } catch(err) {
    return {success: false, result: err}
  }
}

function parse(source) {
  const parser = new jison.Parser(bnf)

  return Object.assign(
    {parser: parser}, parseSource(parser, source)
  )
}

module.exports = { parse }
