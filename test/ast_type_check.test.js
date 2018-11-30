const {
  ValueNode, CompareNode, IfNode, AssignmentNode, RootNode, ArithmeticsNode
} = require("../ast.js")

test("typecheck of positive integer", () => {
  const node = new ValueNode("integer", "5")
  expect(node.value).toBe(5)
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of negative integer", () => {
  const node = new ValueNode("integer", "-20")
  expect(node.value).toBe(-20)
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of integer mismatch double", () => {
  const node = new ValueNode("integer", "5.0")
  expect(node.value).not.toBe(5)
  expect(node.typeCheck()).toBeFalsy()
})

test("typecheck of integer mismatch scandic double", () => {
  const node = new ValueNode("integer", "5,0")
  expect(node.value).not.toBe(5)
  expect(node.typeCheck()).toBeFalsy()
})

test("typecheck of integer mismatch string", () => {
  const node = new ValueNode("integer", "hello")
  expect(node.value).not.toBe(5)
  expect(node.typeCheck()).toBeFalsy()
})

test("typecheck of string", () => {
  const node = new ValueNode("string", "hello")
  expect(node.value).toBe("hello")
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of double", () => {
  const node = new ValueNode("double", "2.5")
  expect(node.value).toBe(2.5)
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of double mismatch", () => {
  const node = new ValueNode("double", "hello")
  expect(node.value).not.toBe("hello")
  expect(node.typeCheck({})).toBeFalsy()
})

test("typecheck of boolean true", () => {
  const node = new ValueNode("boolean", "true")
  expect(node.value).toBeTruthy()
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of boolean false", () => {
  const node = new ValueNode("boolean", "false")
  expect(node.value).toBeFalsy()
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of boolean mismatch", () => {
  const node = new ValueNode("boolean", "something")
  expect(node.value).not.toBe(false)
  expect(node.typeCheck({})).toBeFalsy()
})

test("typecheck of compare eq", () => {
  const node = new CompareNode(
    "eq", new ValueNode("integer", "2"), new ValueNode("integer", "2"))
  expect(node.left.value).toBe(2)
  expect(node.right.value).toBe(2)
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of compare eq mismatch", () => {
  const node = new CompareNode(
    "eq", new ValueNode("integer", "2"), new ValueNode("string", "hello"))
  expect(node.left.value).toBe(2)
  expect(node.right.value).toBe("hello")
  expect(node.typeCheck({})).toBeFalsy()
})

test("typecheck of if node", () => {
  const node = new IfNode(
    new CompareNode(
      "eq", new ValueNode("integer", "2"), new ValueNode("integer", "2")),
    new AssignmentNode("x", new ValueNode("integer", "10"), "integer"),
    new AssignmentNode("y", new ValueNode("boolean", "true"), "boolean"))
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of assignment node of assignment", () => {
  const node = new AssignmentNode("x", new ValueNode("integer", "0"), "integer")
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of assignment node of reassignment", () => {
  const node = new RootNode([
    new AssignmentNode("x", new ValueNode("integer", "0"), "integer"),
    new AssignmentNode("x", new ValueNode("integer", "1"))
  ])
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of assignment node of invalid reassignment", () => {
  const node = new RootNode([
    new AssignmentNode("x", new ValueNode("integer", "0"), "integer"),
    new AssignmentNode("x", new ValueNode("double", "1.0"))
  ])
  expect(node.typeCheck({})).toBeFalsy()
})

test("typecheck of assignment node of invalid reiniti", () => {
  const node = new RootNode([
    new AssignmentNode("x", new ValueNode("integer", "0"), "integer"),
    new AssignmentNode("x", new ValueNode("integer", "1"), "integer")
  ])
  expect(node.typeCheck({})).toBeFalsy()
})

function checkArithmetics(operator, valueType, left, right) {
  const node = new ArithmeticsNode(
    operator,
    new ValueNode(valueType, left),
    new ValueNode(valueType, right))
  expect(node.typeCheck({})).toBeTruthy()
}

// Valid arithmetics

test("typecheck of add integer arithmetics node", () =>
  checkArithmetics("add", "integer", "0", "2"))

test("typecheck of subtract integer arithmetics node", () =>
  checkArithmetics("subtract", "integer", "5", "3"))

test("typecheck of divide integer arithmetics node", () =>
  checkArithmetics("divide", "integer", "5", "3"))

test("typecheck of multiply integer arithmetics node", () =>
  checkArithmetics("multiply", "integer", "5", "3"))

test("typecheck of add double arithmetics node", () =>
  checkArithmetics("add", "double", "2.0", "5.0"))

test("typecheck of subtract double arithmetics node", () =>
  checkArithmetics("subtract", "double", "2.0", "5.0"))

test("typecheck of divide double arithmetics node", () =>
  checkArithmetics("divide", "double", "5.0", "3.0"))

test("typecheck of multiply double arithmetics node", () =>
  checkArithmetics("multiply", "double", "5.0", "3.0"))

test("typecheck of add string arithmetics node", () =>
  checkArithmetics("add", "string", "hello ", "world"))

test("typecheck of add string and integer", () => {
  const node = new ArithmeticsNode(
    "add",
    new ValueNode("integer", "2"),
    new ValueNode("string", " value"))
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of add string and double", () => {
  const node = new ArithmeticsNode(
    "add",
    new ValueNode("double", "2.0"),
    new ValueNode("string", " value"))
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of add string and boolean", () => {
  const node = new ArithmeticsNode(
    "add",
    new ValueNode("string", "is"),
    new ValueNode("boolean", "true"))
  expect(node.typeCheck({})).toBeTruthy()
})

test("typecheck of type add of numbers", () => {
  const node = new ArithmeticsNode(
    "add",
    new ValueNode("double", "2.0"),
    new ValueNode("integer", "3"))
  expect(node.typeCheck({})).toBeTruthy()
})

// Invalid arithmetics

test("typecheck of mismatch type add boolean and double", () => {
  const node = new ArithmeticsNode(
    "add",
    new ValueNode("double", "2.0"),
    new ValueNode("boolean", "true"))
  expect(node.typeCheck({})).toBeFalsy()
})

test("typecheck of mismatch type add boolean and integer", () => {
  const node = new ArithmeticsNode(
    "add",
    new ValueNode("integer", "4"),
    new ValueNode("boolean", "true"))
  expect(node.typeCheck({})).toBeFalsy()
})
