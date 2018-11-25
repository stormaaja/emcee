const parser = require('../parser.js');
const {createNode} = require('../utils.js')

function generateMain(block) {
  return `int main() { ${block} }`
}

test("generates AST for if", () => {
  const source = generateMain("if (2 > 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("return", [], null, {}, "0")
        ], null, {}, createNode("compare_gt", ["2", "1"])),
        createNode("return", [], null, {}, "1")
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})

test("generates AST of if-else greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} else {return 1;}")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("return", [], null, {}, "0"),
          createNode("return", [], null, {}, "1")
          ], null, {}, createNode("compare_gt", ["2", "1"])),
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
          createNode("return", [], null, {}, "1"),
          createNode("return", [], null, {}, "0")
          ], null, {}, createNode("compare_lt", ["2", "1"])),
        ], "main", {argList: [], returnType: "int"})
    ])
  )
})

test("generates AST of assignment", () => {
  const source = generateMain("int i = 0; return i;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("assignment", ["i", "0"], "i", {valueType: "int"}),
        createNode("return", [], null, {}, "i")
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})
