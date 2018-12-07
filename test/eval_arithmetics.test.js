const {ValueNode, ArithmeticsNode} = require("../ast.js")
const { Map } = require("immutable")

test("eval add integers", () => {
  const node = new ArithmeticsNode(
    Map({line: 0}),
    "add",
    new ValueNode(Map({}), "integer", "2"),
    new ValueNode(Map({}), "integer", "5"))
  expect(node.eval(Map({result: 0})).get("result")).toBe(7)
})
