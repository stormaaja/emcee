const parser = require("../parser.js");
const {createNode, addElse} = require("../utils.js")
const {generateMain} = require("../test_utils.js")

test("generates AST of compare greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      createNode("function", [
        createNode("if", [
          createNode("compare_gt", [
            createNode("integer_value", ["2"]),
            createNode("integer_value", ["1"])
          ]),
          [createNode("return", [createNode("integer_value", ["0"])])]
        ]),
        createNode("return", [
          createNode("integer_value", ["1"])
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
            createNode("integer_value", ["1"]),
            createNode("integer_value", ["1"])
          ]),
          [createNode("return", [createNode("integer_value", ["0"])])]]),
        createNode("return", [createNode("integer_value", ["1"])
        ])
      ], "main", {argList: [], returnType: "int"})
    ])
  )
})
