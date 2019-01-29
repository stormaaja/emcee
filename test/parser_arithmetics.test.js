const parser = require("../src/parser.js")
const {createNode} = require("../src/utils.js")
const {
  generateMain, generateProgramNode, createInfo
} = require("../src/test_utils.js")
const {generateNode} = require("../src/ast.js")

test("generates AST of multiply integer", () => {
  const source = generateMain("int x = 2 * 3; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      generateNode({
        nodeType: "assignment",
        children: [
          "x",
          createNode(
            "mul_expr",
            [
              generateNode({
                nodeType: "integer_value",
                children: ["2"],
                info: createInfo(1, 1, 21, 22)}),
              generateNode({
                nodeType: "integer_value",
                children: ["3"],
                info: createInfo(1, 1, 25, 26)})])
        ],
        id: "x",
        meta: {valueType: "int"},
        info: createInfo(1, 1, 13, 16)}),
      generateNode({
        nodeType: "return",
        children: [
          generateNode({
            nodeType: "integer_value",
            children: ["0"],
            info: createInfo(1, 1, 35, 36)
          })
        ],
        info: createInfo(1, 1, 28, 34)})
    ])
  )
})

test("generates AST of subtract integer", () => {
  const source = generateMain("int x = 3 - 2; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      generateNode({
        nodeType: "assignment",
        children: [
          "x",
          createNode("sub_expr", [
            generateNode({
              nodeType: "integer_value",
              children: ["3"],
              info: createInfo(1, 1, 21, 22)}),
            generateNode({
              nodeType: "integer_value",
              children: ["2"],
              info: createInfo(1, 1, 25, 26)})])
        ],
        id: "x",
        meta: {valueType: "int"},
        info: createInfo(1, 1, 13, 16)}),
      generateNode({
        nodeType: "return",
        children: [
        generateNode({
          nodeType: "integer_value",
          children: ["0"],
          info: createInfo(1, 1, 35, 36)
        })],
        info: createInfo(1, 1, 28, 34)})
    ]))
})

test("generates AST of divide integer", () => {
  const source = generateMain("int x = 2 / 3; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      generateNode({
        nodeType: "assignment",
        children: [
          "x",
          createNode("div_expr", [
            generateNode({
              nodeType: "integer_value",
              children: ["2"],
              info: createInfo(1, 1, 21, 22)}),
            generateNode({
              nodeType: "integer_value",
              children: ["3"],
              info: createInfo(1, 1, 25, 26)})])
        ],
        id: "x",
        meta: {valueType: "int"},
        info: createInfo(1, 1, 13, 16)}),
      generateNode({
        nodeType: "return",
        children: [
        generateNode({
          nodeType: "integer_value",
          children: ["0"],
          info: createInfo(1, 1, 35, 36)})],
        info: createInfo(1, 1, 28, 34)})
    ])
  )
})

test("generates AST of divide double", () => {
  const source = generateMain("double x = 2.0 / 3.0; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      generateNode({
        nodeType: "assignment",
        children: [
        "x",
        createNode("div_expr", [
          createNode("double_value", ["2.0"]),
          createNode("double_value", ["3.0"])
        ])],
        id: "x",
        meta: {valueType: "double"},
        info: createInfo(1, 1, 13, 19)}),
      generateNode({
        nodeType: "return",
        children: [
        generateNode({
          nodeType: "integer_value",
          children: ["0"],
          info: createInfo(1, 1, 42, 43)})],
        info: createInfo(1, 1, 35, 41)})
    ])
  )
})


test("generates AST of more complex arithmetics", () => {
  const source = generateMain(
    "double x = 2.0 / 3.0 - 4 * (1 + 4); return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      generateNode({
        nodeType: "assignment",
        children: [
          "x",
          createNode("sub_expr", [
            createNode("div_expr", [
              generateNode({
                nodeType: "double_value",
                children: ["2.0"],
                info: createInfo(0, 0, 0, 0)}),
              createNode("double_value", ["3.0"])]),
            createNode("mul_expr", [
              generateNode({
                nodeType: "integer_value",
                children: ["4"],
                info: createInfo(1, 1, 36, 37)}),
              createNode("add_expr", [
                generateNode({
                  nodeType: "integer_value",
                  children: ["1"],
                  info: createInfo(1, 1, 41, 42)}),
                generateNode({
                  nodeType: "integer_value",
                  children: ["4"],
                  info: createInfo(1, 1, 45, 46)})
              ])
            ])
          ])],
        id: "x",
        meta: {valueType: "double"},
        info: createInfo(1, 1, 13, 19)}),
      generateNode({
        nodeType: "return",
        children: [
          generateNode({
            nodeType: "integer_value",
            children: ["0"],
            info: createInfo(1, 1, 56, 57)})],
        info: createInfo(1, 1, 49, 55)})]))
})

// TODO test int-double combination type
// TODO test value priorities (string vs double vs integer vs boolean)
