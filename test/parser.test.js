const parser = require("../parser.js");
const {createNode} = require("../utils.js")
const {generateMain, generateProgramNode} = require("../test_utils.js")

test("generates AST of if-else greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} else {return 1;}")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("compare_gt", ["2", "1"]),
          createNode("if_body", [createNode("return", ["0"])]),
          createNode("else_body", [createNode("return", ["1"])])
        ]),
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
        createNode("return", ["i"])
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
          createNode("function_call", ["s"], "print")
        ],
        "hello",
        {
          argList: [createNode("argument", [], "s", {valueType: "string"})],
          returnType: "void"
        }),
      createNode("function", [
        createNode("function_call", ["\"Hello World!\""], "hello"),
        createNode("return", ["0"])
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})


test("generates AST of array", () => {
  const source = generateMain(
    "int[] a = [0, 1, 2, 3]; print(a[2]); return a[0];")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode(
      [
        createNode(
          "assignment", [
            "a",
            createNode("array_values", ["0", "1", "2", "3"])
          ],
          "a", {valueType: "array_int"}),
        createNode(
          "function_call", [createNode("array_access", ["a", "2"])], "print"),
        createNode("return", [createNode("array_access", ["a", "0"])])
      ]
    )
  )
})
