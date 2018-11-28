const parser = require("../parser.js");
const {createNode} = require("../utils.js")
const {generateMain} = require("../test_utils.js")

test("generates AST of simple assignment", () => {
  const source = generateMain("int x = 0; return x;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("assignment", [
          "x",
          createNode("integer_value", ["0"])
        ], "x", {valueType: "int"}),
        createNode("return", ["x"])
        ], "main", {argList: [], returnType: "int"})
    ])
  )
})


test("generates AST of usage of an assignment", () => {
  const source = generateMain("string s = \"Hello\"; print(s); return 0;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode(
          "assignment",
          [
            "s",
            createNode("string_value", ["\"Hello\""])
          ],
          "s", {valueType: "string"}),
        createNode("function_call", ["s"], "print"),
        createNode("return", [createNode("integer_value", ["0"])])
        ], "main", {argList: [], returnType: "int"})
    ])
  )
})

test("generates AST of an array assignment", () => {
  const source = generateMain("string[] a = [\"Hello\", \"World\"]; return 0;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("assignment", [
          "a",
          createNode(
            "array_values", [
              createNode("string_value", ["\"Hello\""]),
              createNode("string_value", ["\"World\""])])
        ], "a", {valueType: "array_string"}),
        createNode("return", [createNode("integer_value", ["0"])])
        ], "main", {argList: [], returnType: "int"})
    ])
  )
})
