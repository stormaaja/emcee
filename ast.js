"use strict"
const { Map, List } = require("immutable")

const types = {
  string: "string",
  int: "integer",
  double: "double",
  bool: "boolean",
  array: "array",
  void: "void"
}

const systemFunctions = Map({
  print: Map({
    arguments: List(["string"]),
    returnType: "void"
  })
})

function generateNode(data) {
  const {nodeType, id} = data
  const children = List(data.children)
  const info = Map(data.info || {
    first_line: 0,
    last_line: 0,
    first_column: 0,
    last_column: 0
  })
  const meta = data.meta || Map()
  switch (nodeType) {
  case "root": {
    return new RootNode(children)
  }
  case "function": {
    return new FunctionNode(
      info, id, List(children), List(meta.argList), types[meta.returnType])
  }
  case "function_call": {
    return new FunctionCallNode(info, id, List(children))
  }
  case "return": {
    return new ReturnNode(info, children.first())
  }
  case "symbol": {
    return new SymbolNode(info, id)
  }
  case "string_value": {
    return new ValueNode(info, "string", children.first())
  }
  case "integer_value": {
    return new ValueNode(info, "integer", children.first())
  }
  case "double_value": {
    return new ValueNode(info, "double", children.first())
  }
  case "boolean_value": {
    return new ValueNode(info, "boolean", children.first())
  }
  case "array_values": {
    return new ValueNode(info, "array", children)
  }
  case "array_access": {
    return new ArrayAccessNode(info, id, children.first())
  }
  case "argument": {
    return new ArgumentNode(info, id, types[meta.valueType])
  }
  case "assignment": {
    return new AssignmentNode(info, id, children.get(1), types[meta.valueType])
  }
  case "compare_gt": {
    return new CompareNode(info, "gt", children.first(), children.get(1))
  }
  case "compare_lt": {
    return new CompareNode(info, "lt", children.first(), children.get(1))
  }
  case "compare_eq": {
    return new CompareNode(info, "eq", children.first(), children.get(1))
  }
  case "if": {
    return new IfNode(
      info, children.first(), List(children.get(1)), List(children.get(2)))
  }
  case "while": {
    return new WhileNode(info, children.first(), children.get(1))
  }
  case "add_expr": {
    return new ArithmeticsNode(info, "add", children.first(), children.get(1))
  }
  case "sub_expr": {
    return new ArithmeticsNode(info, "subtract", children.first(), children.get(1))
  }
  case "mul_expr": {
    return new ArithmeticsNode(info, "multiply", children.first(), children.get(1))
  }
  case "div_expr": {
    return new ArithmeticsNode(info, "div", children.first(), children.get(1))
  }

  default: {
    throw Error("Unknown node type: " + nodeType)
  }
  }
}

const errorMessages = {
  ifExprMustBeBool: "If expression must return boolean",
  invalidArithmetics: "Invalid arithmetics expression",
  comparingMismatch: "Comparision must be done with values of the same type",
  assignExprConflict: "Assignment type does not match expression type",
  notInitialized: "Value is not initialized",
  alreadyInitialized: "Value is already initialized",
  invalidType: "Invalid type for value",
  whileExprMustBeBool: "While expression must return boolean",
  functionDoesNotExist: "Function does not exist",
  fnParamInvalidType: "Function parameter type is invalid",
  invalidReturnValue: "Return value type does not match function signature",
  multipleDifferentReturnValues:
  "Function has multiple different return values",
  fnAlreadyExists: "Function or variable of given name already exists",
  symbolDoesNotExist: "Symbol does not exist"
}

function createError(id, node) {
  if (!errorMessages[id]) throw Error(`Error ${id} does not exists`)
  return Map({
    id: id,
    message: errorMessages[id],
    node: node
  })
}

function typeCheckEach(nodes, typeEnv) {
  if (nodes.isEmpty()) {
    return typeEnv
  } else {
    return typeCheckEach(nodes.shift(), nodes.first().typeCheck(typeEnv))
  }
}

function evalEach(nodes, env) {
  if (nodes.isEmpty()) {
    return env
  } else {
    return evalEach(nodes.shift(), nodes.first().eval(env))
  }
}

class RootNode {
  constructor(children) {
    this.children = children
  }
  typeCheck() {
    const typeEnv = Map({types: systemFunctions, errors: List()})
    return typeCheckEach(this.children, typeEnv)
  }
  eval() {
    return evalEach(this.children, Map({result: 0})).get("result")
  }
}

class FunctionNode {
  constructor(info, id, children, argList, returnType) {
    this.info = info
    this.id = id
    this.children = children
    this.returnType = returnType
    this.argList = argList || List()
  }

  checkReturnType() {
    const returnNodes = this.children.filter(
      c => (c instanceof ReturnNode))
    if (returnNodes.countBy(v => v.type).size > 1)
      return createError("multipleDifferentReturnValues", this)
    const returnValueType = returnNodes.isEmpty() ?
      "void" : returnNodes.first().type
    return returnValueType === this.returnType ?
      null : createError("invalidReturnValue", this)
  }

  checkReinit(typeEnv) {
    return typeEnv.hasIn(["types", this.id]) ?
      createError("fnAlreadyExists", this) : null
  }

  typeCheck(typeEnv) {
    const errors = [
      this.checkReturnType(), this.checkReinit(typeEnv)].filter(x => x)

    const argTypes = this.argList.map(a => a.type)
    const env = typeEnv.setIn(["types", this.id], Map({
      arguments: argTypes,
      returnType: this.returnType
    }))
    const envT = typeCheckEach(this.argList, env)

    return env.update(
      "errors",
      e => e.concat(
        typeCheckEach(this.children, envT).get("errors"),
        envT.get("errors"),
        errors
      )
    )
  }
}

class ReturnNode{
  constructor(info, expression) {
    this.info = info
    this.expression = expression
    this.type = this.expression.type
  }
  typeCheck(typeEnv) {
    return this.expression.typeCheck(typeEnv)
  }
}

class FunctionCallNode {
  constructor(info, id, params) {
    this.info = info
    this.id = id
    this.params = params
  }
  typeCheck(typeEnv) {
    // TODO check that param types matches function signature
    // TODO check if assignment matches function return value
    const errors = [
      typeEnv.getIn(["types", this.id]) ?
        null : createError("functionDoesNotExist", this)
    ].filter(x => x)
    const paramErrors = typeCheckEach(this.params, typeEnv).get("errors")
    const fnTypes = typeEnv.getIn(["types", this.id, "arguments"])
    const paramTypeErrors = fnTypes ? this.params.map(
      (p, i) => matchingTypes(p.type, fnTypes.get(i)) ?
        null : createError("fnParamInvalidType", p)
    ).filter(x => x) : []
    return typeEnv.update("errors", (e) => e.concat(
      errors, paramErrors, paramTypeErrors
    ))
  }
}

class ArrayAccessNode {
  constructor(info, id, expression) {
    this.info = info
    this.id = id
    this.expression = expression
  }

  checkExpr() {
    return this.expression.type === "integer" ?
      createError("arrayAccessExprMustBeInteger", this) : null
  }
  checkArrayExists(typeEnv) {
    return typeEnv.hasIn(["types", this.id]) ?
      null : createError("valueDoesNoteExists", this)
  }
  typeCheck(typeEnv) {
    const errors = [
      this.checkArrayExists(typeEnv), this.checkExpr()
    ].filter(x => x)
    const exprErrors = this.expression.typeCheck(typeEnv).get("errors")
    return typeEnv.update("errors", e => e.concat(errors, exprErrors))
  }
}

class WhileNode {
  constructor(info, expression, body) {
    this.info = info
    this.expression = expression
    this.body = body
  }
  typeCheck(typeEnv) {
    const exprErrors = this.expression.typeCheck(typeEnv).get("errors")
    const errors = this.expression.type === "boolean" ?
      [] : [createError("whileExprMustBeBool", this)]
    return typeEnv.update("errors", (e) => e.concat(
      exprErrors, errors))
  }
}

class IfNode {
  constructor(info, expression, ifBody, elseBody) {
    this.info = info
    this.expression = expression
    this.ifBody = ifBody || List()
    this.elseBody = elseBody || List()
  }
  typeCheck(typeEnv) {
    const env = this.expression.type === "boolean" ?
      typeEnv :
      typeEnv.update(
        "errors", l => l.push(createError("ifExprMustBeBool", this)))

    const exprErrors = this.expression.typeCheck(typeEnv).get("errors")
    const ifErrors = typeCheckEach(this.ifBody, typeEnv).get("errors")
    const elseErrors = typeCheckEach(this.elseBody, typeEnv).get("errors")

    return typeEnv.set(
      "errors", env.get("errors").concat(exprErrors, ifErrors, elseErrors))
  }
}

class CompareNode {
  constructor(info, comparision, left, right) {
    this.info = info
    this.comparision = comparision
    this.left = left
    this.right = right
    this.type = "boolean"
  }
  typeCheck(typeEnv) {
    const leftErrors = this.left.typeCheck(typeEnv)
    const rightErrors = this.right.typeCheck(typeEnv)
    return matchingTypes(this.left.type, this.right.type)
      ? typeEnv : typeEnv.update(
        "errors", v => v.push(createError(
          "comparingMismatch", this)))
  }
}

const operators = {
  "add": (x, y) => x + y
}

const isOneString = (t1, t2) =>
  t1 === "string" ||
  t2 === "string"

const typePriorities = ["boolean", "integer", "double", "string"]

const numberTypes = ["double", "integer"]

const isBothNumbers = (t1, t2) =>
  numberTypes.includes(t1) && numberTypes.includes(t2)

const matchingTypes = (t1, t2) =>
  t1 === t2 || isOneString(t1, t2) || isBothNumbers(t1, t2)

const getTopType = (t1, t2) =>
  typePriorities.indexOf(t1) > typePriorities.indexOf(t2) ? t1 : t2

const detectType = (t1, t2) =>
  matchingTypes(t1, t2) ?
    getTopType(t1, t2) : new InvalidValueType(t1)

class ArithmeticsNode {
  constructor(info, operator, left, right) {
    this.info = info
    this.operator = operator
    this.left = left
    this.right = right
    this.type = detectType(this.left.type, this.right.type)
  }
  typeCheck(typeEnv) {
    return typeEnv.update(
      "errors",
      v => v.concat(
        this.left.typeCheck(typeEnv).get("errors"),
        this.right.typeCheck(typeEnv).get("errors"),
        isValid(this.type) ?
          [] : [createError("invalidArithmetics", this)]))
  }
  eval(env) {
    return operators[this.operator](this.left.eval(env), this.right.eval(env))
  }
}

class AssignmentNode {
  constructor(info, id, expression, type) {
    this.info = info
    this.id = id
    this.expression = expression
    this.type = type
  }

  checkTypeMatch(typeEnv) {
    const type = this.type ? this.type : typeEnv.getIn(["types", this.id])
    if (type) {
      return matchingTypes(type, this.expression.type) ?
        null : createError("assignExprConflict", this)
    } else {
      return createError("notInitialized", this)
    }
  }

  checkReinit(typeEnv) {
    return this.type && typeEnv.hasIn(["types", this.id]) ?
      createError("alreadyInitialized", this) : null
  }

  typeCheck(typeEnv) {
    const errors = [
      this.checkTypeMatch(typeEnv), this.checkReinit(typeEnv)
    ].filter(x => x)

    const nodeTypeEnv =
      this.type ? typeEnv.setIn(["types", this.id], this.type) : typeEnv

    return nodeTypeEnv.update("errors", (v) => v.concat(
      this.expression.typeCheck(nodeTypeEnv).get("errors"),
      errors))
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

const integerPattern = /^-?\d+$/

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
  constructor(info, type, value) {
    this.info = info
    this.type = type
    this.value = parseValue(type, value)
  }
  typeCheck(typeEnv) {
    return isValid(this.value) ?
      typeEnv : typeEnv.update(
        "errors", v => v.push(createError("invalidType", this)))
  }
  eval() {
    return this.value
  }
}

class SymbolNode {
  constructor(info, id) {
    this.info = info
    this.id = id
  }
  typeCheck(typeEnv) {
    const type = typeEnv.getIn(["types", this.id])

  // Following is not sustainable and system wide consistent solution
    // TODO Fix it
    if (!this.type) {
      this.type = type
    }

    return type ?
      typeEnv : typeEnv.update(
        "errors", e => e.concat([createError("symbolDoesNotExists")]))
  }
}

class ArgumentNode {
  constructor(info, type, id) {
    this.info = info
    this.type = type
    this.id = id
  }
  typeCheck(typeEnv) {
    return typeEnv.set(this.id, this.type)
  }
}

module.exports = {
  generateNode, ValueNode, CompareNode, ArithmeticsNode, IfNode, AssignmentNode,
  RootNode, FunctionNode, WhileNode, ArrayAccessNode, FunctionCallNode,
  ReturnNode, ArgumentNode
}
