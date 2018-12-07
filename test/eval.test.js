const {
  ValueNode, ArithmeticsNode, FunctionCallNode, RootNode, AssignmentNode,
  SymbolNode, IfNode, CompareNode
} = require("../ast.js")
const { Map, List } = require("immutable")

const info = Map({})

test("eval arithmetics", () => {
  const node = new ArithmeticsNode(
    Map({}),
    "subtract",
    new ArithmeticsNode(
      Map({}),
      "div",
      new ValueNode(Map({}), "double", "5.0"),
      new ArithmeticsNode(
        Map({}),
        "add",
        new ValueNode(Map({}), "integer", "2"),
        new ValueNode(Map({}), "double", "3.0"))),
    new ArithmeticsNode(
      Map({}),
      "multiply",
      new ValueNode(Map({}), "double", "3.0"),
      new ValueNode(Map({}), "integer", "7")))
  expect(node.eval(Map({result: 0})).get("result")).toBe(-20)
})

test("eval system function double to string call", () => {
  const node = new FunctionCallNode(
    Map({}),
    "d_to_str",
    List([new ValueNode(Map({}), "double", "2.5")]))
  expect(node.eval(Map({result: 0})).get("result")).toBe("2.5")
})

test("eval system function integer to string call", () => {
  const node = new FunctionCallNode(
    Map({}),
    "to_str",
    List([new ValueNode(Map({}), "integer", "2")]))
  expect(node.eval(Map({result: 0})).get("result")).toBe("2")
})

test("eval if", () => {
  const node = new IfNode(
    info,
    new CompareNode(
      info,
      "lt",
      new ValueNode(info, "integer", "2"),
      new ValueNode(info, "integer", "3")),
    List([new ValueNode(info, "string", "yes")]))
  expect(node.eval(Map({result: 0})).get("result")).toBe("yes")
})

test("eval if false", () => {
  const node = new IfNode(
    info,
    new CompareNode(
      info,
      "eq",
      new ValueNode(info, "integer", "2"),
      new ValueNode(info, "integer", "3")),
    List([new ValueNode(info, "string", "nope")]))
  expect(node.eval(Map({result: 0})).get("result")).toBe(0)
})

test("eval if else", () => {
  const node = new IfNode(
    info,
    new CompareNode(
      info,
      "gt",
      new ValueNode(info, "integer", "2"),
      new ValueNode(info, "integer", "3")),
    List([new ValueNode(info, "string", "no")]),
    List([new ValueNode(info, "string", "yes")]))
  expect(node.eval(Map({result: 0})).get("result")).toBe("yes")
})

test("eval symbol", () => {
  const node = new RootNode(
    List([
      new AssignmentNode(
        info,
        "x",
        new ValueNode(info, "integer", "2")),
      new SymbolNode(info, "x")]))
  expect(node.eval(Map({result: 0}))).toBe(2)
})
