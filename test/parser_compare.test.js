const parser = require('../parser.js');
const {createNode} = require('../utils.js')

function generateMain(block) {
  return `int main() { ${block} }`
}

test("generates AST of compare greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("compare_gt", ["2", "1"]),
          createNode("if_body", [createNode("return", ["0"])])
        ]),
        createNode("return", ["1"])
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})

test("generates AST of compare less than", () => {
  const source = generateMain("if (2 < 1) {return 1;} else {return 0;}")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("compare_lt", ["2", "1"]),
          createNode("if_body", [createNode("return", ["1"])]),
          createNode("else_body", [createNode("return", ["0"])])
          ]),
        ], "main", {argList: [], returnType: "int"})
    ])
  )
})

test("generates AST of compare equals", () => {
  const source = generateMain("if (1 == 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("compare_eq", ["1", "1"]),
          createNode("if_body", [createNode("return", ["0"])])]),
        createNode("return", ["1"])
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})
