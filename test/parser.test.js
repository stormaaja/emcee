const parser = require("../parser.js");
const {createNode, addElse} = require("../utils.js")
const {
  generateMain, generateProgramNode, createInfo
} = require("../test_utils.js")
const {generateNode} = require("../ast.js")
const {List} = require("immutable")

test("generates AST of if-else greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} else {return 1;}")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      generateNode({
        nodeType: "function",
        children: [
          generateNode({
            nodeType: "if",
            children: [
              createNode("compare_gt", [
                generateNode({
                  nodeType: "integer_value",
                  children: ["2"],
                  info: createInfo(1, 1, 17, 18)}),
                generateNode({
                  nodeType: "integer_value",
                  children: ["1"],
                  info: createInfo(1, 1, 21, 22)})
              ]),
              [
                createNode("return", [
                  generateNode({
                    nodeType: "integer_value",
                    children: ["0"],
                    info: createInfo(1, 1, 32, 33)})

                ])],
              [
                createNode("return", [
                  generateNode({
                    nodeType: "integer_value",
                    children: ["1"],
                    info: createInfo(1, 1, 49, 50)})
                ])]
            ],
            info: createInfo(1, 1, 13, 15)})
        ],
        id: "main",
        meta: {argList: [], returnType: "int"},
        info: createInfo(1, 1, 0, 3)})
    ])
  )
})

test("generates AST of assignment", () => {
  const source = generateMain("int i = 0; return i;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      generateNode({
        nodeType: "function",
        children: List([
          generateNode({
            nodeType: "assignment",
            children: [
            "i",
            generateNode({
              nodeType: "integer_value",
              children: ["0"],
              info: createInfo(1, 1, 21, 22)})
          ],
            id: "i",
            meta: {valueType: "int"},}),
          createNode("return", [
            generateNode({
                nodeType: "symbol",
                id: "i",
                info: createInfo(1, 1, 31, 32)}),])
        ]),
        id: "main",
        meta: {argList: [], returnType: "int"},
        info: createInfo(1, 1, 0, 3)})
    ])
  )
})

test("generates AST of function call", () => {
  const main = generateMain("hello(\"Hello World!\"); return 0;")
  const source = `void hello(string s) {print(s);} ${main}`
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      generateNode({
        nodeType: "function",
        children: List([
          generateNode({
            nodeType: "function_call",
            children: List([
              generateNode({
                nodeType: "symbol",
                id: "s",
                info: createInfo(1, 1, 28, 29)})]),
            id: "print",
            info: createInfo(1, 1, 22, 27)})
        ]),
        id: "hello",
        meta: {
          argList: [
            createNode(
              "argument",
              [],
              "s",
              {valueType: "string"})],
          returnType: "void"
        },
        info: createInfo(1, 1, 0, 4)}),
      generateNode({
        nodeType: "function",
        children: List([
          generateNode({
            nodeType: "function_call",
            children: List([
              createNode("string_value", ["\"Hello World!\""])
            ]),
            id: "hello",
            info: createInfo(1, 1, 46, 51)}),
          createNode("return", [
            generateNode({
              nodeType: "integer_value",
              children: ["0"],
              info: createInfo(1, 1, 76, 77)})
          ])
        ]),
        id: "main",
        meta: {argList: [], returnType: "int"},
      info: createInfo(1, 1, 33, 36)})
    ])
  )
})


test("generates AST of array", () => {
  const source = generateMain(
    "int[] a = [0, 1, 2, 3]; print(a[2]); return a[0];")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
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
      generateNode({
        nodeType: "function_call",
        children: List([
          createNode("array_access", [
            "a",
            createNode("integer_value", ["2"])])]),
        id: "print",
        info: createInfo(1, 1, 37, 42)}),
      createNode("return", [
        createNode("array_access", [
          "a",
          createNode("integer_value", ["0"])])])])
  )
})

// TODO tests for booleans
