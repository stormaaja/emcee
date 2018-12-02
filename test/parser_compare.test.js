const parser = require("../parser.js");
const {createNode, addElse} = require("../utils.js")
const {generateMain, createInfo} = require("../test_utils.js")
const {generateNode} = require("../ast.js")

test("generates AST of compare greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      generateNode({
        nodeType: "function",
        children: [
        createNode("if", [
          createNode("compare_gt", [
            generateNode(
              {nodeType: "integer_value",
               children: ["2"],
               info: createInfo(1, 1, 17, 18)}),
            generateNode({
              nodeType: "integer_value",
              children: ["1"],
              info: createInfo(1, 1, 21, 22)})
          ]),
          [createNode("return", [
            generateNode({
              nodeType: "integer_value",
              children: ["0"],
              info: createInfo(1, 1, 32, 33)})])]
        ]),
        createNode("return", [
          generateNode({
            nodeType: "integer_value",
            children: ["1"],
            info: createInfo(1, 1, 43, 44)})
        ])],
        id: "main",
        meta: {argList: [], returnType: "int"},
        info: createInfo(1, 1, 0, 3)
      })
    ])
  )
})

test("generates AST of compare less than", () => {
  const source = generateMain("if (2 < 1) {return 1;} else {return 0;}")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      generateNode({
        nodeType: "function",
        children: [
        addElse(
          createNode("if", [
            createNode("compare_lt", [
              createNode("integer_value", ["2"]),
              createNode("integer_value", ["1"])
            ]),
            [createNode("return", [createNode("integer_value", ["1"])])]
          ]),
          [createNode("return", [createNode("integer_value", ["0"])])])],
        id: "main",
        meta: {argList: [], returnType: "int"},
        info: createInfo(1, 1, 0, 3)})
    ])
  )
})

test("generates AST of compare equals", () => {
  const source = generateMain("if (1 == 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      generateNode({
        nodeType: "function",
        children: [
          createNode("if", [
            createNode("compare_eq", [
              generateNode({
                nodeType: "integer_value",
                children: ["1"],
                info: createInfo(1, 1, 17, 18)}),
              generateNode({
                nodeType: "integer_value",
                children: ["1"],
                info: createInfo(1, 1, 22, 23)})
            ]),
            [createNode("return", [
              generateNode({
                nodeType: "integer_value",
                children: ["0"],
                info: createInfo(1, 1, 33, 34)})])]]),
          createNode("return", [
            generateNode({
              nodeType: "integer_value",
              children: ["1"],
              info: createInfo(1, 1, 44, 45)})
          ])
        ],
        id: "main",
        meta: {
          argList: [],
          returnType: "int"},
        info: createInfo(1, 1, 0, 3)
      })
    ])
  )
})
