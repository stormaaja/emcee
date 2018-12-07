const {
  ValueNode, ArithmeticsNode, FunctionCallNode
} = require("../ast.js")
const { Map, List } = require("immutable")

test("eval add integers", () => {
  const node = new ArithmeticsNode(
    Map({}),
    "add",
    new ValueNode(Map({}), "integer", "2"),
    new ValueNode(Map({}), "integer", "5"))
  expect(node.eval(Map({result: 0})).get("result")).toBe(7)
})

test("eval system function call", () => {
  const node = new FunctionCallNode(
    Map({}),
    "d_to_str",
    List([new ValueNode(Map({}), "double", "2.5")]))
  expect(node.eval(Map({result: 0})).get("result")).toBe("2.5")
})
