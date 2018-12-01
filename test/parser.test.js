const parser = require("../parser.js");
const {createNode, addElse} = require("../utils.js")
const {generateMain, generateProgramNode} = require("../test_utils.js")
const {generateNode} = require("../ast.js")

test("generates AST of if-else greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} else {return 1;}")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        addElse(
          createNode("if", [
            createNode("compare_gt", [
              createNode("integer_value", ["2"]),
              createNode("integer_value", ["1"])
            ]),
            createNode("return", [
              createNode("integer_value", ["0"])
            ])
          ]),
          createNode("return", [
            createNode("integer_value", ["1"])]))
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})

test("generates AST of assignment", () => {
  const source = generateMain("int i = 0; return i;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("assignment", [
          "i",
          createNode("integer_value", ["0"])
        ], "i", {valueType: "int"}),
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
        createNode("function_call", [
          createNode("string_value", ["\"Hello World!\""])
        ], "hello"),
        createNode("return", [
          generateNode({
            nodeType: "integer_value",
            children: ["0"],
            info: {line: 1, column: 76}})
        ])
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
            createNode("array_values", [
              createNode("integer_value", ["0"]),
              createNode("integer_value", ["1"]),
              createNode("integer_value", ["2"]),
              createNode("integer_value", ["3"])])
          ],
          "a", {valueType: "array_int"}),
        createNode(
          "function_call", [
            createNode("array_access", [
              "a",
              createNode("integer_value", ["2"])])],
          "print"),
        createNode("return", [
          createNode("array_access", [
            "a",
            createNode("integer_value", ["0"])])])
      ]
    )
  )
})

// TODO tests for booleans
