"use strict"
const { Map, List } = require("immutable")

// TODO change typechecks to return results instead of success boolean

function generateNode(data) {
  const {nodeType, id, meta} = data
  const children = List(data.children)
  switch (nodeType) {
  case "root": {
    return new RootNode(List(children))
  }
  case "function": {
    return new FunctionNode(id, List(children), meta)
  }
  case "function_call": {
    return new FunctionCallNode(id, List(children))
  }
  case "return": {
    return new ReturnNode(children.first())
  }
  case "string_value": {
    return new ValueNode("string", children.first())
  }
  case "integer_value": {
    return new ValueNode("integer", children.first())
  }
  case "double_value": {
    return new ValueNode("double", children.first())
  }
  case "boolean_value": {
    return new ValueNode("boolean", children.first())
  }
  case "array_values": {
    return new ValueNode("array", children)
  }
  case "array_access": {
    return new ArrayAccessNode(id, children.first())
  }
  case "argument": {
    return new ArgumentNode(id, meta.valueType)
  }
  case "assignment": {
    return new AssignmentNode(id, children[1], meta.valueType)
  }
  case "compare_gt": {
    return new CompareNode("gt", children.first(), children.get(1))
  }
  case "compare_lt": {
    return new CompareNode("lt", children.first(), children.get(1))
  }
  case "compare_eq": {
    return new CompareNode("eq", children.first(), children.get(1))
  }
  case "if": {
    return new IfNode(children.first(), children.get(1))
  }
  case "while": {
    return new WhileNode(children.first(), children.get(1))
  }
  case "add_expr": {
    return new ArithmeticsNode("add", children.first(), children.get(1))
  }
  case "sub_expr": {
    return new ArithmeticsNode("subtract", children.first(), children.get(1))
  }
  case "mul_expr": {
    return new ArithmeticsNode("multiply", children.first(), children.get(1))
  }
  case "div_expr": {
    return new ArithmeticsNode("div", children.first(), children.get(1))
  }

  default: {
    throw Error("Unknown node type: " + nodeType)
  }
  }
}

function typeCheckEach(nodes, typeEnv) {
  if (nodes.isEmpty()) {
    return typeEnv
  } else {
    return typeCheckEach(nodes.shift(), nodes.first().typeCheck(typeEnv))
  }
}

class RootNode {
  constructor(children) {
    this.children = children
  }
  typeCheck() {
    const typeEnv = Map({types: Map(), errors: Map()})
    return typeCheckEach(this.children, typeEnv)
  }
}

class FunctionNode {
  constructor(id, children, meta) {
    this.id = id
    this.children = children
    this.returnType = meta.returnType
    this.argList = meta.argList
  }
}

class ReturnNode{
  constructor(expression) {
    this.expression = expression
  }
}

class FunctionCallNode {
  constructor(id, params) {
    this.id = id
    this.params = params
  }
}

class ArrayNode {
  constructor(id, elements, type) {
    this.id = id
    this.elements = elements
    this.type = type
  }
}

class ArrayAccessNode {
  constructor(id, expression) {
    this.id = id
    this.expression = expression
  }
}

class WhileNode {
  constructor(expression, body) {
    this.expression = expression
    this.body = body
  }
}

class IfNode {
  constructor(expression, ifBody, elseBody) {
    this.expression = expression
    this.ifBody = ifBody
    this.elseBody = elseBody
  }
  typeCheck(typeEnv) {
    return this.expression.typeCheck(typeEnv) &&
      this.expression.type === "boolean" &&
      this.ifBody.typeCheck(typeEnv) &&
      (!this.elseBody || this.elseBody.typeCheck(typeEnv))
  }
}

class CompareNode {
  constructor(comparision, left, right) {
    this.comparision = comparision
    this.left = left
    this.right = right
    this.type = "boolean"
  }
  typeCheck() {
    return this.left.type === this.right.type
  }
}

const operators = {
  "add": (x, y) => x + y
}

const isOneString = (t1, t2) =>
      t1 === "string" ||
      t2 === "string"

const numberTypes = ["double", "integer"]

const isBothNumbers = (t1, t2) =>
      numberTypes.includes(t1) && numberTypes.includes(t2)

const matchingTypes = (t1, t2) =>
      t1 === t2 || isOneString(t1, t2) || isBothNumbers(t1, t2)

class ArithmeticsNode {
  constructor(operator, left, right) {
    this.operator = operator
    this.left = left
    this.right = right
    this.type = matchingTypes(this.left.type, this.right.type) ?
      left.type : new InvalidValueType(left.type)
  }
  typeCheck(typeEnv) {
    return this.left.typeCheck(typeEnv) &&
      this.right.typeCheck(typeEnv) &&
      isValid(this.type)
  }
  eval(env) {
    return operators[this.operator](this.left.eval(env), this.right.eval(env))
  }
}

class AssignmentNode {
  constructor(id, expression, type) {
    this.id = id
    this.expression = expression
    this.type = type
  }
  typeCheck(typeEnv) {
    const types = {}
    if (this.type && typeEnv[this.id]) {
      return false
    }

    const nodeTypeEnv =
      this.type ? addValue(typeEnv, this.id, this.type) : typeEnv

    return this.expression.typeCheck(nodeTypeEnv) &&
      nodeTypeEnv[this.id] === this.expression.type
  }
}

class InvalidValueType {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

const isValid = (valueType) => !(valueType instanceof InvalidValueType)

function parseNumber(parser, pattern, value) {
  const parsedValue = parser(value)
  if (value.match(pattern) && !isNaN(parsedValue) && isFinite(parsedValue))
    return parsedValue
  else
    return new InvalidValueType("", value)
}

const integerPattern = /^\-?\d+$/

function parseInteger(value) {
  return parseNumber(parseInt, integerPattern, value)
}

const doublePattern = /^[0-9]+(\.[0-9]+)?$/

function parseDouble(value) {
  return parseNumber(parseFloat, doublePattern, value)
}

const parsers = {
  "integer": (x) => parseInteger(x),
  "string": (x) => x,
  "double": (x) => parseDouble(x),
  "boolean": (x) => {
    switch(x) {
      case "true": return true
      case "false": return false
      default: return new InvalidValueType(x)
    }
  }
}

function parseValue(type, value) {
  const parser = parsers[type]
  if (parser)
    return parser(value)
  else
    return new InvalidValueType(type)
}

class ValueNode {
  constructor(type, value) {
    this.type = type
    this.value = parseValue(type, value)
  }
  typeCheck() {
    return isValid(this.value)
  }
  eval() {
    return this.value
  }
}

class ArgumentNode{
  constructor(type, id) {
    this.type = type
    this.id = id
  }
  typeCheck(typeEnv) {
    return typeEnv.set(this.id, this.type)
  }
}

module.exports = {
  generateNode, ValueNode, CompareNode, ArithmeticsNode, IfNode, AssignmentNode,
  RootNode
}
