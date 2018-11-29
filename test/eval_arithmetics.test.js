const {ValueNode, ArithmeticsNode} = require("../ast.js")

test("eval add integers", () => {
  const node = new ArithmeticsNode(
    "add", new ValueNode("integer", "2"), new ValueNode("integer", "5"))
  expect(node.eval()).toBe(7)
})
