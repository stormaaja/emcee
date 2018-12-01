const {
  ValueNode, CompareNode, IfNode, AssignmentNode, RootNode, ArithmeticsNode,
  FunctionNode
} = require("../ast.js")

const { Map, List } = require("immutable")

const noErrors = (x) => x.get("errors").isEmpty()

const typeEnv = Map({errors: Map(), types: Map()})

test("typecheck of positive integer", () => {
  const node = new ValueNode(Map({line: 0}), "integer", "5")
  expect(node.value).toBe(5)
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of negative integer", () => {
  const node = new ValueNode(Map({line: 0}), "integer", "-20")
  expect(node.value).toBe(-20)
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of integer mismatch double", () => {
  const node = new ValueNode(Map({line: 0}), "integer", "5.0")
  expect(node.value).not.toBe(5)
  expect(
    node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck of integer mismatch scandic double", () => {
  const node = new ValueNode(Map({line: 0}), "integer", "5,0")
  expect(node.value).not.toBe(5)
  expect(
    node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck of integer mismatch string", () => {
  const node = new ValueNode(Map({line: 0}), "integer", "hello")
  expect(node.value).not.toBe(5)
  expect(
    node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck of string", () => {
  const node = new ValueNode(Map({line: 0}), "string", "hello")
  expect(node.value).toBe("hello")
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of double", () => {
  const node = new ValueNode(Map({line: 0}), "double", "2.5")
  expect(node.value).toBe(2.5)
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of double mismatch", () => {
  const node = new ValueNode(Map({line: 0}), "double", "hello")
  expect(node.value).not.toBe("hello")
  expect(
    node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck of boolean true", () => {
  const node = new ValueNode(Map({line: 0}), "boolean", "true")
  expect(node.value).toBeTruthy()
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of boolean false", () => {
  const node = new ValueNode(Map({line: 0}), "boolean", "false")
  expect(node.value).toBeFalsy()
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of boolean mismatch", () => {
  const node = new ValueNode(Map({line: 0}), "boolean", "something")
  expect(node.value).not.toBe(false)
  expect(
    node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck of compare eq", () => {
  const node = new CompareNode(
    Map({line: 0}),
    "eq",
    new ValueNode(Map({line: 1}), "integer", "2"),
    new ValueNode(Map({line: 2}), "integer", "2"))
  expect(node.left.value).toBe(2)
  expect(node.right.value).toBe(2)
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of compare eq mismatch", () => {
  const node = new CompareNode(
    Map({line: 0}),
    "eq",
    new ValueNode(Map({line: 1}), "integer", "2"),
    new ValueNode(Map({line: 2}), "string", "hello"))
  expect(node.left.value).toBe(2)
  expect(node.right.value).toBe("hello")
  expect(
    node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck of if node", () => {
  const node = new IfNode(Map({line: 0}),
    new CompareNode(
      Map({line: 0}),
      "eq",
      new ValueNode(Map({line: 1}), "integer", "2"),
      new ValueNode(Map({line: 2}), "integer", "2")),
    List([
      new AssignmentNode(
        Map({line: 3}), "x", new ValueNode(Map({line: 4}), "integer", "10"),
        "integer")]),
    List([
      new AssignmentNode(
        Map({line: 5}), "y", new ValueNode(Map({line: 6}), "boolean", "true"),
        "boolean")]))
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of assignment node of assignment", () => {
  const node = new AssignmentNode(
    Map({line: 0}), "x", new ValueNode(Map({line: 0}), "integer", "0"),
    "integer")
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of assignment node of reassignment", () => {
  const node = new RootNode( List([
    new AssignmentNode(
      Map({line: 0}), "x", new ValueNode(Map({line: 0}), "integer", "0"),
      "integer"),
    new AssignmentNode(
      Map({line: 0}), "x", new ValueNode(Map({line: 0}), "integer", "1"))
  ]))
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of assignment node of invalid reassignment", () => {
  const node = new RootNode( List([
    new AssignmentNode(
      Map({line: 0}), "x", new ValueNode(Map({line: 0}), "integer", "0"),
      "integer"),
    new AssignmentNode(
      Map({line: 0}), "x", new ValueNode(Map({line: 0}), "double", "1.0"))
  ]))
  expect(
    node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck of assignment node of invalid reinit", () => {
  const node = new RootNode(List([
    new AssignmentNode(
      Map({line: 0}), "x", new ValueNode(Map({line: 0}), "integer", "0"),
      "integer"),
    new AssignmentNode(
      Map({line: 1}), "x", new ValueNode(Map({line: 1}), "integer", "1"),
      "integer")
  ]))
  expect(
    node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

function checkArithmetics(operator, valueType, left, right) {
  const node = new ArithmeticsNode(Map({line: 0}),
    operator,
    new ValueNode(Map({line: 0}), valueType, left),
    new ValueNode(Map({line: 0}), valueType, right))
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
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
  const node = new ArithmeticsNode(Map({line: 0}),
    "add",
    new ValueNode(Map({line: 0}), "integer", "2"),
    new ValueNode(Map({line: 1}), "string", " value"))
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of add string and double", () => {
  const node = new ArithmeticsNode(Map({line: 0}),
    "add",
    new ValueNode(Map({line: 0}), "double", "2.0"),
    new ValueNode(Map({line: 1}), "string", " value"))
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of add string and boolean", () => {
  const node = new ArithmeticsNode(Map({line: 0}),
    "add",
    new ValueNode(Map({line: 0}), "string", "is"),
    new ValueNode(Map({line: 1}), "boolean", "true"))
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

test("typecheck of type add of numbers", () => {
  const node = new ArithmeticsNode(Map({line: 0}),
    "add",
    new ValueNode(Map({line: 0}), "double", "2.0"),
    new ValueNode(Map({line: 1}), "integer", "3"))
  expect(
    node.typeCheck(typeEnv).get("errors").isEmpty()).toBeTruthy()
})

// Invalid arithmetics

test("typecheck of mismatch type add boolean and double", () => {
  const node = new ArithmeticsNode(Map({line: 0}),
    "add",
    new ValueNode(Map({line: 0}), "double", "2.0"),
    new ValueNode(Map({line: 1}), "boolean", "true"))
  expect(node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck of mismatch type add boolean and integer", () => {
  const node = new ArithmeticsNode(Map({line: 0}),
    "add",
    new ValueNode(Map({line: 0}), "integer", "4"),
    new ValueNode(Map({line: 1}), "boolean", "true"))
  expect(node.typeCheck(typeEnv).get("errors").size).toBe(1)
})

test("typecheck to ignore function cross variables", () => {
  const node = new RootNode(List([
    new FunctionNode(Map({line: 0}), "fun_one", List([
      new AssignmentNode(
        Map({line: 1}), "x", new ValueNode(Map({line: 1}), "integer", "0"),
        "integer")
    ]), {returnType: "void"}),
    new FunctionNode(Map({line: 0}), "fun_two", List([
      new AssignmentNode(
        Map({line: 1}), "x", new ValueNode(Map({line: 1}), "integer", "0"),
        "integer")
    ]), {returnType: "void"})
  ]))
  expect(noErrors(node.typeCheck(typeEnv))).toBeTruthy()
})

test("typecheck for global conflict", () => {
  const node = new RootNode(List([
    new AssignmentNode(
      Map({line: 1}), "x", new ValueNode(Map({line: 1}), "integer", "0"),
      "integer"),
    new FunctionNode(Map({line: 2}), "fun_one", List([
      new AssignmentNode(
        Map({line: 3}), "x", new ValueNode(Map({line: 3}), "integer", "0"),
        "integer")
    ]), {returnType: "void"})
  ]))
  expect(node.typeCheck(typeEnv).get("errors").size).toBe(1)
})


// TODO global assignment allow and conflict
// TODO argument config
// TODO function param arg typecheck
// TODO function id conflict
// TODO function and variable conflict
// TODO function call exists
