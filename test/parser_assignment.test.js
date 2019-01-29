const parser = require("../src/parser.js");
const {generateNode} = require("../src/ast.js")
const {generateMain, createInfo}  = require("../src/test_utils.js")

test("generates AST of simple assignment", () => {
  const source = generateMain("int x = 0; return x;")
  expect(parser.parse(source).result).toEqual(
    generateNode({
      nodeType: "root",
      children: [
        generateNode({
          nodeType: "function",
          children: [
            generateNode({
              nodeType: "assignment",
              children: [
                generateNode({
                  nodeType: "symbol",
                  id: "x",
                  info: createInfo(0, 0, 0, 0)}),
                generateNode({
                  nodeType: "integer_value",
                  children: ["0"],
                  info: createInfo(1, 1, 21, 22)})
              ],
              id: "x",
              meta: {valueType: "int"},
              info: createInfo(1, 1, 13, 16)}),
            generateNode({
              nodeType: "return",
              children: [
                generateNode({
                  nodeType: "symbol",
                  id: "x",
                  info: createInfo(1, 1, 31, 32)})],
              info: createInfo(1, 1, 24, 30)})
          ],
          id: "main",
          meta: {argList: [], returnType: "int"},
          info: createInfo(1, 1, 0, 3)})
      ]})
  )
})


test("generates AST of usage of an assignment", () => {
  const source = generateMain("string s = \"Hello\"; print(s); return 0;")
  expect(parser.parse(source).result).toEqual(
    generateNode({
      nodeType: "root",
      children: [
        generateNode({
          nodeType: "function",
          children: [
            generateNode({
              nodeType:
              "assignment",
              children: [
                "s",
                generateNode({
                  nodeType: "string_value", children: ["\"Hello\""]})
              ],
              id: "s",
              meta: {valueType: "string"},
              info: createInfo(1, 1, 13, 19)}),
            generateNode({
              nodeType: "function_call",
              children: [
                generateNode({
                  nodeType: "symbol",
                  id: "s",
                  info: createInfo(1, 1, 39, 40)})],
              id: "print",
              info: createInfo(1, 1, 33, 38)
            }),
            generateNode({
              nodeType: "return",
              children: [
                generateNode({
                  nodeType: "integer_value",
                  children: ["0"],
                  info: createInfo(1, 1, 50, 51)
                })],
              info: createInfo(1, 1, 43, 49)})],
          id: "main",
          meta: {argList: [], returnType: "int"},
          info: createInfo(1, 1, 0, 3)})
      ]})
  )
})

test("generates AST of an array assignment", () => {
  const source = generateMain("string[] a = [\"Hello\", \"World\"]; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateNode({
      nodeType: "root",
      children: [
        generateNode({
          nodeType: "function",
          children: [
            generateNode({
              nodeType: "assignment",
              children: [
                "a",
                generateNode({
                  nodeType: "array_values",
                  children: [
                    generateNode(
                      {nodeType: "string_value", children: ["\"Hello\""]}),
                    generateNode(
                      {nodeType: "string_value", children: ["\"World\""]})]})],
              id: "a",
              meta: {valueType: "array_string"},
              info: createInfo(1, 1, 13, 21)}),
            generateNode({
              nodeType: "return",
              children: [
                generateNode({
                  nodeType: "integer_value",
                  children: ["0"],
                  info: createInfo(1, 1, 53, 54)})],
              info: createInfo(1, 1, 46, 52)})],
          id: "main",
          meta: {argList: [], returnType: "int"},
          info: createInfo(1, 1, 0, 3)})]})
  )
})
