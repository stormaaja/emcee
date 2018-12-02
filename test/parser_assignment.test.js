const parser = require("../parser.js");
const {generateNode} = require("../ast.js")
const {generateMain, createInfo}  = require("../test_utils.js")

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
                "x",
                generateNode({
                  nodeType: "integer_value",
                  children: ["0"]})
              ],
              id: "x",
              meta: {valueType: "int"}}),
            generateNode({nodeType: "return", children: ["x"]})
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
    generateNode({nodeType: "root", children: [
      generateNode({
        nodeType: "function",
        children: [
          generateNode({
            nodeType:
            "assignment",
            children: [
              "s",
              generateNode({nodeType: "string_value", children: ["\"Hello\""]})
            ],
            id: "s",
            meta: {valueType: "string"}}),
          generateNode({
            nodeType: "function_call",
            children: ["s"],
            id: "print",
            info: createInfo(1, 1, 33, 38)
          }),
          generateNode({nodeType: "return", children: [
            generateNode({
              nodeType: "integer_value",
              children: ["0"],
              info: createInfo(1, 1, 50, 51)
            })]})],
        id: "main",
        meta: {argList: [], returnType: "int"},
        info: createInfo(1, 1, 0, 3)})
    ]})
  )
})

test("generates AST of an array assignment", () => {
  const source = generateMain("string[] a = [\"Hello\", \"World\"]; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateNode({nodeType: "root", children: [
      generateNode({nodeType: "function", children: [
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
          meta: {valueType: "array_string"}}),
        generateNode({
          nodeType: "return",
          children: [
            generateNode({
              nodeType: "integer_value",
              children: ["0"],
              info: createInfo(1, 1, 53, 54)})]})],
                    id: "main",
                    meta: {argList: [], returnType: "int"},
                    info: createInfo(1, 1, 0, 3)})
    ]})
  )
})
