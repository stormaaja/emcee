const {generateNode} = require("./ast.js")
const {List} = require("immutable")

function generateMain(block) {
  return `int main() { ${block} }`
}

function generateProgramNode(children) {
  return generateNode({
    nodeType: "root",
    children: List([
      generateNode({
        nodeType: "function",
        children: List(children),
        id: "main",
        meta: {argList: [], returnType: "int"},
        info: createInfo(1, 1, 0, 3)})]),
    info: createInfo(0, 0, 0, 0)})
}

function createInfo(fl, ll, fc, lc) {
  return {
    first_line: fl || 0,
    last_line: ll || 0,
    first_column: fc || 0,
    last_column: lc || 0}
}

module.exports = {generateMain, generateProgramNode, createInfo}
