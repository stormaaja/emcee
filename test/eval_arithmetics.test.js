const {ValueNode, ArithmeticsNode} = require("../ast.js")
const { Map } = require("immutable")

test("eval add integers", () => {
  const node = new ArithmeticsNode(
    Map({line: 0}),
    "add",
    new ValueNode(Map({line: 0}), "integer", "2"),
    new ValueNode(Map({line: 0}), "integer", "5"))
  expect(node.eval()).toBe(7)
})
