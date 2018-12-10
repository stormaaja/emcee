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
                generateNode({
                  nodeType: "return",
                  children: [
                    generateNode({
                      nodeType: "integer_value",
                      children: ["0"],
                      info: createInfo(1, 1, 32, 33)})
                  ],
                  info: createInfo(1, 1, 25, 31)})],
              [
                generateNode({
                  nodeType: "return",
                  children: [
                    generateNode({
                      nodeType: "integer_value",
                      children: ["1"],
                      info: createInfo(1, 1, 49, 50)})
                  ],
                  info: createInfo(1, 1, 42, 48)})
              ]
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
            meta: {valueType: "int"},
            info: createInfo(1, 1, 13, 16)}),
          generateNode({
            nodeType: "return",
            children: [
              generateNode({
                nodeType: "symbol",
                id: "i",
                info: createInfo(1, 1, 31, 32)})],
            info: createInfo(1, 1, 24, 30)})
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
          generateNode({
            nodeType: "return",
            children: [
              generateNode({
                nodeType: "integer_value",
                children: ["0"],
                info: createInfo(1, 1, 76, 77)})
            ],
            info: createInfo(1, 1, 69, 75)})
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
      generateNode({
        nodeType: "assignment",
        children: [
          "a",
          createNode("array_values", [
            generateNode({
              nodeType: "integer_value",
              children: ["0"],
              info: createInfo(1, 1, 24, 25)}),
            generateNode({
              nodeType: "integer_value",
              children: ["1"],
              info: createInfo(1, 1, 27, 28)}),
            generateNode({
              nodeType: "integer_value",
              children: ["2"],
              info: createInfo(1, 1, 30, 31)}),
            generateNode({
              nodeType: "integer_value",
              children: ["3"],
              info: createInfo(1, 1, 33, 34)})])
        ],
        id: "a",
        meta: {valueType: "array_int"},
        info: createInfo(1, 1, 13, 18)}),
      generateNode({
        nodeType: "function_call",
        children: List([
          generateNode({
            nodeType: "array_access",
            id: "a",
            children: [
              "a",
              generateNode({
                nodeType: "integer_value",
                children: ["2"],
                info: createInfo(1, 1, 45, 46)})],
            info: createInfo()})]),
        id: "print",
        info: createInfo(1, 1, 37, 42)}),
      generateNode({
        nodeType: "return",
        children: [
          generateNode({
            nodeType: "array_access",
            id: "a",
            children: [
              "a",
              generateNode({
                nodeType: "integer_value",
                children: ["0"],
                info: createInfo(1, 1, 59, 60)})],
            info: createInfo()})
        ],
        info: createInfo(1, 1, 50, 56)})
    ])
  )
})

// TODO tests for booleans
