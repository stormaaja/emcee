const parser = require("../parser.js");
const {createNode, addElse} = require("../utils.js")
const {generateMain} = require("../test_utils.js")
const {generateNode} = require("../ast.js")

test("generates AST of compare greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("compare_gt", [
            generateNode(
              {nodeType: "integer_value",
               children: ["2"],
               info: {line: 1, column: 17}}),
            generateNode({
              nodeType: "integer_value",
              children: ["1"],
              info: {line: 1, column: 21}})
          ]),
          [createNode("return", [
            generateNode({
              nodeType: "integer_value",
              children: ["0"],
              info: {line: 1, column: 32}})])]
        ]),
        createNode("return", [
          generateNode({
            nodeType: "integer_value",
            children: ["1"],
            info: {line: 1, column: 43}})
        ])
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})

test("generates AST of compare less than", () => {
  const source = generateMain("if (2 < 1) {return 1;} else {return 0;}")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        addElse(
          createNode("if", [
            createNode("compare_lt", [
              createNode("integer_value", ["2"]),
              createNode("integer_value", ["1"])
            ]),
            [createNode("return", [createNode("integer_value", ["1"])])]
          ]),
          [createNode("return", [createNode("integer_value", ["0"])])]),
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})

test("generates AST of compare equals", () => {
  const source = generateMain("if (1 == 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("compare_eq", [
            generateNode({
              nodeType: "integer_value",
              children: ["1"],
              info: {line: 1, column: 17}}),
            generateNode({
              nodeType: "integer_value",
              children: ["1"],
              info: {line: 1, column: 22}})
          ]),
          [createNode("return", [
            generateNode({
              nodeType: "integer_value",
              children: ["0"],
              info: {line: 1, column: 33}})])]]),
        createNode("return", [
          generateNode({
            nodeType: "integer_value",
            children: ["1"],
            info: {line: 1, column: 44}})
        ])
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})
