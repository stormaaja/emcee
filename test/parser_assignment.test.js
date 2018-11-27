const parser = require('../parser.js');
const {createNode} = require('../utils.js')

function generateMain(block) {
  return `int main() { ${block} }`
}

test("generates AST of simple assignment", () => {
  const source = generateMain("int x = 0; return x;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("assignment", ["x", "0"], "x", {valueType: "int"}),
        createNode("return", ["x"])
        ], "main", {argList: [], returnType: "int"})
    ])
  )
})
