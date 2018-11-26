const parser = require('../parser.js');
const {createNode} = require('../utils.js')

function generateMain(block) {
  return `int main() { ${block} }`
}

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

test("generates AST of function call", () => {
  const main = generateMain("hello(\"Hello World!\"); return 0;")
  const source = `void hello(string s) {print(s);} ${main}`
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode(
        "function",
        [
          createNode("function_call", [], "print", {paramList: ["s"]})
        ],
        "hello",
        {
          argList: [createNode("argument", [], "s", {valueType: "string"})],
          returnType: "void"
        }),
      createNode("function", [
        createNode("function_call", [], "hello",
                   {paramList: ["\"Hello World!\""]}),
        createNode("return", [], null, {}, "0")
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})
