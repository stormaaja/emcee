const {ValueNode, CompareNode} = require("../ast.js")

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
