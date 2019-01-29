const parser = require("../src/parser.js");
const {createNode} = require("../src/utils.js")
const {generateMain, createInfo} = require("../src/test_utils.js")
const {generateNode} = require("../src/ast.js")
const {List} = require("immutable")

test("generates AST of compare greater than", () => {
  const source = generateMain("if (2 > 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
      generateNode({
        nodeType: "function",
        children: [
          generateNode({
            nodeType: "if",
            children: List([
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
              [
                generateNode({
                  nodeType: "return",
                  children: [
                  generateNode({
                    nodeType: "integer_value",
                    children: ["0"],
                    info: createInfo(1, 1, 32, 33)})],
                  info: createInfo(1, 1, 25, 31)})]
            ]),
            info: createInfo(1, 1, 13, 15)}),
          generateNode({
            nodeType: "return",
            children: [
            generateNode({
              nodeType: "integer_value",
              children: ["1"],
              info: createInfo(1, 1, 43, 44)})],
            info: createInfo(1, 1, 36, 42)})],
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
          generateNode({
            nodeType: "if",
            children: [
              generateNode({
                nodeType: "compare_lt",
                children: [
                  generateNode({
                    nodeType: "integer_value",
                    children: ["2"],
                    info: createInfo(1, 1, 17, 18)}),
                  generateNode({
                    nodeType: "integer_value",
                    children: ["1"],
                    info: createInfo(1, 1, 21, 22)})
                ],
                info: createInfo(0, 0, 0, 0)}),
              [
                generateNode({
                  nodeType: "return",
                  children: [
                    generateNode({
                      nodeType: "integer_value",
                      children: ["1"],
                      info: createInfo(1, 1, 32, 33)})
                  ],
                  info: createInfo(1, 1, 25, 31)})],
              [
                generateNode({
                  nodeType: "return",
                  children: [
                    generateNode({
                      nodeType: "integer_value",
                      children: ["0"],
                      info: createInfo(1, 1, 49, 50)})
                  ],
                  info: createInfo(1, 1, 42, 48)})]
            ],
            info: createInfo(1, 1, 13, 15)
          }),
        ],
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
          generateNode({
            nodeType: "if",
            children: [
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
              [
                generateNode({
                  nodeType: "return",
                  children: [
                    generateNode({
                      nodeType: "integer_value",
                      children: ["0"],
                      info: createInfo(1, 1, 33, 34)})],
                  info: createInfo(1, 1, 26, 32)})]],
            info: createInfo(1, 1, 13, 15)}),
          generateNode({
            nodeType: "return",
            children: [
              generateNode({
                nodeType: "integer_value",
                children: ["1"],
                info: createInfo(1, 1, 44, 45)})
            ],
            info: createInfo(1, 1, 37, 43)})
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
