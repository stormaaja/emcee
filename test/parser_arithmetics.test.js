const parser = require("../parser.js")
const {createNode} = require("../utils.js")
const {
  generateMain, generateProgramNode, createInfo
} = require("../test_utils.js")
const {generateNode} = require("../ast.js")

test("generates AST of multiply integer", () => {
  const source = generateMain("int x = 2 * 3; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      createNode("assignment", [
        "x",
        createNode("mul_expr", [
          createNode("integer_value", ["2"]),
            createNode("integer_value", ["3"])])
        ], "x", {valueType: "int"}),
        createNode("return", [
          generateNode({
            nodeType: "integer_value",
            children: ["0"],
            info: createInfo(1, 1, 35, 36)
          })
        ])
      ]
    )
  )
})

test("generates AST of subtract integer", () => {
  const source = generateMain("int x = 3 - 2; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      createNode("assignment", [
        "x",
        createNode("sub_expr", [
          createNode("integer_value", ["3"]),
          createNode("integer_value", ["2"])])
      ],"x", {valueType: "int"}),
      createNode("return", [
        generateNode({
          nodeType: "integer_value",
          children: ["0"],
          info: createInfo(1, 1, 35, 36)
        })])
    ]))
})

test("generates AST of divide integer", () => {
  const source = generateMain("int x = 2 / 3; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      createNode("assignment", [
        "x",
        createNode("div_expr", [
          createNode("integer_value", ["2"]),
          createNode("integer_value", ["3"])])
      ], "x", {valueType: "int"}),
      createNode("return", [
        generateNode({
          nodeType: "integer_value",
          children: ["0"],
          info: createInfo(1, 1, 35, 36)})])
    ])
  )
})

test("generates AST of divide double", () => {
  const source = generateMain("double x = 2.0 / 3.0; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      createNode("assignment", [
        "x",
        createNode("div_expr", [
          createNode("double_value", ["2.0"]),
          createNode("double_value", ["3.0"])
        ])], "x", {valueType: "double"}),
      createNode("return", [
        generateNode({
          nodeType: "integer_value",
          children: ["0"],
          info: createInfo(1, 1, 42, 43)})])
    ])
  )
})


test("generates AST of more complex arithmetics", () => {
  const source = generateMain(
    "double x = 2.0 / 3.0 - 4 * (1 + 4); return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode([
      createNode("assignment", [
        "x",
        createNode("sub_expr", [
          createNode("div_expr", [
            createNode("double_value", ["2.0"]),
            createNode("double_value", ["3.0"])]),
          createNode("mul_expr", [
            createNode("integer_value", ["4"]),
            createNode("add_expr", [
              createNode("integer_value", ["1"]),
              createNode("integer_value", ["4"])])
          ])
        ])], "x", {valueType: "double"}),
      createNode("return", [
        generateNode({
          nodeType: "integer_value",
          children: ["0"],
          info: createInfo(1, 1, 56, 57)})])]))
})

// TODO test int-double combination type
// TODO test value priorities (string vs double vs integer vs boolean)
