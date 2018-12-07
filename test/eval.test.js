const {
  ValueNode, ArithmeticsNode, FunctionCallNode
} = require("../ast.js")
const { Map, List } = require("immutable")

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
