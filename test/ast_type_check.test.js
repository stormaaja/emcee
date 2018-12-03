const {
  ValueNode, CompareNode, IfNode, AssignmentNode, RootNode, ArithmeticsNode,
  FunctionNode, WhileNode, FunctionCallNode, ReturnNode, ArgumentNode
} = require("../ast.js")

const { Map, List } = require("immutable")

const typeEnv = Map({errors: List(), types: Map()})

const createInfo = (line, column) => Map({line, column})

function expectErrors(typeEnv, errors, count) {
  const typeErrorIds = typeEnv.get("errors").toJS().map(e => e.id)
  expect(typeErrorIds.length).toBe(count)
  errors.forEach(e => expect(typeErrorIds).toContain(e))
}

function expectNoErrors(typeEnv) {
  expect(typeEnv.get("errors").isEmpty()).toBeTruthy()
}

test("typecheck of positive integer", () => {
  const node = new ValueNode(createInfo(0, 0), "integer", "5")
  expect(node.value).toBe(5)
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of negative integer", () => {
  const node = new ValueNode(createInfo(0, 0), "integer", "-20")
  expect(node.value).toBe(-20)
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of integer mismatch double", () => {
  const node = new ValueNode(createInfo(0, 0), "integer", "5.0")
  expect(node.value).not.toBe(5)
  expectErrors(node.typeCheck(typeEnv), ["invalidType"], 1)
})

test("typecheck of integer mismatch scandic double", () => {
  const node = new ValueNode(createInfo(0, 0), "integer", "5,0")
  expect(node.value).not.toBe(5)
  expectErrors(node.typeCheck(typeEnv), ["invalidType"], 1)
})

test("typecheck of integer mismatch string", () => {
  const node = new ValueNode(createInfo(0, 0), "integer", "hello")
  expect(node.value).not.toBe(5)
  expectErrors(node.typeCheck(typeEnv), ["invalidType"], 1)
})

test("typecheck of string", () => {
  const node = new ValueNode(createInfo(0, 0), "string", "hello")
  expect(node.value).toBe("hello")
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of double", () => {
  const node = new ValueNode(createInfo(0, 0), "double", "2.5")
  expect(node.value).toBe(2.5)
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of double mismatch", () => {
  const node = new ValueNode(createInfo(0, 0), "double", "hello")
  expect(node.value).not.toBe("hello")
  expectErrors(node.typeCheck(typeEnv), ["invalidType"], 1)
})

test("typecheck of boolean true", () => {
  const node = new ValueNode(createInfo(0, 0), "boolean", "true")
  expect(node.value).toBeTruthy()
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of boolean false", () => {
  const node = new ValueNode(createInfo(0, 0), "boolean", "false")
  expect(node.value).toBeFalsy()
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of boolean mismatch", () => {
  const node = new ValueNode(createInfo(0, 0), "boolean", "something")
  expect(node.value).not.toBe(false)
  expectErrors(node.typeCheck(typeEnv), ["invalidType"], 1)
})

test("typecheck of compare eq", () => {
  const node = new CompareNode(
    createInfo(0, 0),
    "eq",
    new ValueNode(createInfo(1, 0), "integer", "2"),
    new ValueNode(createInfo(2, 0), "integer", "2"))
  expect(node.left.value).toBe(2)
  expect(node.right.value).toBe(2)
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of compare eq mismatch", () => {
  const node = new CompareNode(
    createInfo(0, 0),
    "eq",
    new ValueNode(createInfo(1, 0), "integer", "2"),
    new ValueNode(createInfo(2, 0), "string", "hello"))
  expect(node.left.value).toBe(2)
  expect(node.right.value).toBe("hello")
  expectErrors(node.typeCheck(typeEnv), ["comparingMismatch"], 1)
})

test("typecheck of if node", () => {
  const node = new IfNode(createInfo(0, 0),
    new CompareNode(
      createInfo(0, 0),
      "eq",
      new ValueNode(createInfo(1, 0), "integer", "2"),
      new ValueNode(createInfo(2, 0), "integer", "2")),
    List([
      new AssignmentNode(
        createInfo(3, 0), "x", new ValueNode(createInfo(4, 0), "integer", "10"),
        "integer")]),
    List([
      new AssignmentNode(
        createInfo(5, 0), "y", new ValueNode(createInfo(6, 0), "boolean", "true"),
        "boolean")]))
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of assignment node of assignment", () => {
  const node = new AssignmentNode(
    createInfo(0, 0), "x", new ValueNode(createInfo(0, 0), "integer", "0"),
    "integer")
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of assignment node of reassignment", () => {
  const node = new RootNode( List([
    new AssignmentNode(
      createInfo(0, 0), "x", new ValueNode(createInfo(0, 0), "integer", "0"),
      "integer"),
    new AssignmentNode(
      createInfo(0, 0), "x", new ValueNode(createInfo(0, 0), "integer", "1"))
  ]))
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of assignment node of invalid reassignment", () => {
  const node = new RootNode( List([
    new AssignmentNode(
      createInfo(0, 0), "x", new ValueNode(createInfo(0, 0), "integer", "0"),
      "integer"),
    new AssignmentNode(
      createInfo(0, 0), "x", new ValueNode(createInfo(0, 0), "double", "1.0"))
  ]))
  expectErrors(node.typeCheck(typeEnv), ["assignExprConflict"], 1)
})

test("typecheck of assignment node of invalid reinit", () => {
  const node = new RootNode(List([
    new AssignmentNode(
      createInfo(0, 0), "x", new ValueNode(createInfo(0, 0), "integer", "0"),
      "integer"),
    new AssignmentNode(
      createInfo(1, 0), "x", new ValueNode(createInfo(1, 0), "integer", "1"),
      "integer")
  ]))
  expectErrors(node.typeCheck(typeEnv), ["alreadyInitialized"], 1)
})

function checkArithmetics(operator, valueType, left, right) {
  const node = new ArithmeticsNode(createInfo(0, 0),
    operator,
    new ValueNode(createInfo(0, 0), valueType, left),
    new ValueNode(createInfo(0, 0), valueType, right))
  expectNoErrors(node.typeCheck(typeEnv))
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
  const node = new ArithmeticsNode(createInfo(0, 0),
    "add",
    new ValueNode(createInfo(0, 0), "integer", "2"),
    new ValueNode(createInfo(1, 0), "string", " value"))
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of add string and double", () => {
  const node = new ArithmeticsNode(createInfo(0, 0),
    "add",
    new ValueNode(createInfo(0, 0), "double", "2.0"),
    new ValueNode(createInfo(1, 0), "string", " value"))
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of add string and boolean", () => {
  const node = new ArithmeticsNode(createInfo(0, 0),
    "add",
    new ValueNode(createInfo(0, 0), "string", "is"),
    new ValueNode(createInfo(1, 0), "boolean", "true"))
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of type add of numbers", () => {
  const node = new ArithmeticsNode(createInfo(0, 0),
    "add",
    new ValueNode(createInfo(0, 0), "double", "2.0"),
    new ValueNode(createInfo(1, 0), "integer", "3"))
  expectNoErrors(node.typeCheck(typeEnv))
})

// Invalid arithmetics

test("typecheck of mismatch type add boolean and double", () => {
  const node = new ArithmeticsNode(createInfo(0, 0),
    "add",
    new ValueNode(createInfo(0, 0), "double", "2.0"),
    new ValueNode(createInfo(1, 0), "boolean", "true"))
  expectErrors(node.typeCheck(typeEnv), ["invalidArithmetics"], 1)
})

test("typecheck of mismatch type add boolean and integer", () => {
  const node = new ArithmeticsNode(createInfo(0, 0),
    "add",
    new ValueNode(createInfo(0, 0), "integer", "4"),
    new ValueNode(createInfo(1, 0), "boolean", "true"))
  expectErrors(node.typeCheck(typeEnv), ["invalidArithmetics"], 1)
})

test("typecheck to ignore function cross variables", () => {
  const node = new RootNode(List([
    new FunctionNode(createInfo(0, 0), "fun_one", List([
      new AssignmentNode(
        createInfo(1, 0), "x", new ValueNode(createInfo(1, 0), "integer", "0"),
        "integer")
    ]), {returnType: "void"}),
    new FunctionNode(createInfo(0, 0), "fun_two", List([
      new AssignmentNode(
        createInfo(1, 0), "x", new ValueNode(createInfo(1, 0), "integer", "0"),
        "integer")
    ]), {returnType: "void"})
  ]))
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck for global conflict", () => {
  const node = new RootNode(List([
    new AssignmentNode(
      createInfo(1, 0), "x", new ValueNode(createInfo(1, 0), "integer", "0"),
      "integer"),
    new FunctionNode(createInfo(2, 0), "fun_one", List([
      new AssignmentNode(
        createInfo(3, 0), "x", new ValueNode(createInfo(3, 0), "integer", "0"),
        "integer")
    ]), {returnType: "void"})
  ]))
  expectErrors(node.typeCheck(typeEnv), ["alreadyInitialized"], 1)
})

test("typecheck of while", () => {
  const node = new WhileNode(
    createInfo(0, 0),
    new CompareNode(
      createInfo(0, 0),
      "gt",
      new ValueNode(createInfo(1, 0), "integer", "2"),
      new ValueNode(createInfo(2, 0), "integer", "3")),
    new AssignmentNode(
      createInfo(3, 0), "x", new ValueNode(createInfo(3, 0), "integer", "0"),
      "integer"))
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck of while with invalid expression", () => {
  const node = new WhileNode(
    createInfo(0, 0),
    new AssignmentNode(
      createInfo(3, 0), "x", new ValueNode(createInfo(3, 0), "integer", "0"),
      "integer"),
    new AssignmentNode(
      createInfo(3, 0), "y", new ValueNode(createInfo(3, 0), "integer", "0"),
      "integer"))
  expectErrors(node.typeCheck(typeEnv), ["whileExprMustBeBool"], 1)
})

test("typecheck for function call", () => {
  const node = new RootNode(List([
    new FunctionNode(
      createInfo(0, 0),
      "fun_one",
      List([
        new ReturnNode(
          createInfo(1, 0),
          new ValueNode(createInfo(1, 0), "integer", "0"))
      ]),
      {
        returnType: "integer",
        argList: List([
          new ArgumentNode(createInfo(1, 0), "string", "z")
        ])
      }),
    new FunctionCallNode(
      createInfo(0, 0),
      "fun_one",
      List([new ValueNode(createInfo(1, 0), "string", "hello")]))
  ]))
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck for function call with invalid type param", () => {
  const node = new RootNode(List([
    new FunctionNode(
      createInfo(0, 0),
      "fun_one",
      List([
        new ReturnNode(
          createInfo(1, 0),
          new ValueNode(createInfo(1, 0), "integer", "0"))
      ]),
      {
        returnType: "integer",
        argList: List([
          new ArgumentNode(createInfo(1, 0), "string", "z")
        ])
      }),
    new FunctionCallNode(
      createInfo(0, 0),
      "fun_one",
      List([new ValueNode(createInfo(1, 0), "integer", "0")]))
  ]))
  expectErrors(node.typeCheck(typeEnv), ["fnParamInvalidType"], 1)
})

test("typecheck for non existing function call", () => {
  const node = new RootNode(List([
    new FunctionCallNode(
      createInfo(0, 0),
      "fun_missing",
      List([new ValueNode(createInfo(1, 0), "integer", "0")]))
  ]))
  expectErrors(node.typeCheck(typeEnv), ["functionDoesNotExist"], 1)
})

test("typecheck for function return value", () => {
  const node = new FunctionNode(
    createInfo(0, 0),
    "fun",
    List([
      new ReturnNode(
        createInfo(1, 0),
        new ValueNode(createInfo(1, 0), "integer", "0"))]),
    {returnType: "integer"})
  expectNoErrors(node.typeCheck(typeEnv))
})

test("typecheck for invalid function return value", () => {
  const node = new FunctionNode(
    createInfo(0, 0),
    "fun",
    List([
      new ReturnNode(
        createInfo(1, 0),
        new ValueNode(createInfo(1, 0), "string", "hello"))]),
    {returnType: "integer"})
  expectErrors(node.typeCheck(typeEnv), ["invalidReturnValue"], 1)
})

// TODO global assignment allow and conflict
// TODO argument config
// TODO function param arg typecheck
// TODO function id conflict
// TODO function and variable conflict
// TODO function call exists
// TODO function return type
