const {createNode} = require("./utils.js")

function generateMain(block) {
  return `int main() { ${block} }`
}

function generateProgramNode(children) {
  return createNode("root", [
    createNode(
      "function", children, "main", {argList: [], returnType: "int"})
  ])
}

function createInfo(fl, ll, fc, lc) {
  return {first_line: fl || 0,
          last_line: ll || 0,
          first_column: fc || 0,
          last_column: lc || 0}
}

module.exports = {generateMain, generateProgramNode, createInfo}
