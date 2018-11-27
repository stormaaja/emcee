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

module.exports = {generateMain, generateProgramNode}
