const parser = require("../parser.js")
const {createNode} = require("../utils.js")
const {generateMain, generateProgramNode} = require("../test_utils.js")

test("generates AST of multiply integer", () => {
  const source = generateMain("int x = 2 * 3; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode(
      [
        createNode(
          "assignment",
          ["x", createNode("mul_expr", ["2", "3"])],
          "x", {valueType: "int"}),
        createNode("return", ["0"])
      ]
    )
  )
})

test("generates AST of divide integer", () => {
  const source = generateMain("int x = 2 / 3; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode(
      [
        createNode(
          "assignment",
          ["x", createNode("div_expr", ["2", "3"])],
          "x", {valueType: "int"}),
        createNode("return", ["0"])
      ]
    )
  )
})

test("generates AST of subtract integer", () => {
  const source = generateMain("int x = 3 - 2; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode(
      [
        createNode(
          "assignment",
          ["x", createNode("sub_expr", ["3", "2"])],
          "x", {valueType: "int"}),
        createNode("return", ["0"])
      ]
    )
  )
})

test("generates AST of divide integer", () => {
  const source = generateMain("int x = 2 / 3; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode(
      [
        createNode(
          "assignment",
          ["x", createNode("div_expr", ["2", "3"])],
          "x", {valueType: "int"}),
        createNode("return", ["0"])
      ]
    )
  )
})


test("generates AST of divide double", () => {
  const source = generateMain("double x = 2.0 / 3.0; return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode(
      [
        createNode(
          "assignment",
          ["x", createNode("div_expr", ["2.0", "3.0"])],
          "x", {valueType: "double"}),
        createNode("return", ["0"])
      ]
    )
  )
})


test("generates AST of more complex arithmetics", () => {
  const source = generateMain(
    "double x = 2.0 / 3.0 - 4 * (1 + 4); return 0;")
  expect(parser.parse(source).result).toEqual(
    generateProgramNode(
      [
        createNode(
          "assignment",
          ["x",
           createNode(
             "sub_expr",
             [
               createNode("div_expr", ["2.0", "3.0"]),
               createNode(
                 "mul_expr",
                 [
                   "4",
                   createNode("add_expr", ["1", "4"])
                 ])
             ])],
          "x", {valueType: "double"}),
        createNode("return", ["0"])
      ]
    )
  )
})
