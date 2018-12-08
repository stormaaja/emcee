"use strict"
const { Map, List } = require("immutable")

const types = {
  string: "string",
  int: "integer",
  double: "double",
  bool: "boolean",
  array: "array",
  void: "void",
  array_int: "array_integer",
  array_string: "array_string",
  array_double: "array_double",
  array_boolean: "array_boolean"
}

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
    return new ArrayAccessNode(info, id, children.get(1))
  }
  case "argument": {
    return new ArgumentNode(info, types[meta.valueType], id)
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
    return new WhileNode(info, children.first(), List(children.get(1)))
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
  fnAlreadyExists: "Function or variable of given name already exists",
  symbolDoesNotExist: "Symbol does not exist"
}

function createError(id, node) {
  if (!node) throw Error("Node can't be null. Error: " + id)
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
    this.children = systemFunctions.concat(children)
  }
  typeCheck() {
    const typeEnv = Map({
      functions: List(),
      types: systemFunctionTypes,
      errors: List(),
      variables: Map()})
    return typeCheckEach(this.children, typeEnv)
  }
  eval() {
    const env = evalEach(this.children, Map({
      functions: Map(),
      result: 0,
      variables: Map()}))
    return (env.hasIn(["functions", "main"]) ?
      env.getIn(["functions", "main"]).call(env) : env).get("result")
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

  getType() {
    return this.returnType
  }

  checkReinit(typeEnv) {
    return typeEnv.hasIn(["types", this.id]) ?
      createError("fnAlreadyExists", this) : null
  }

  typeCheck(typeEnv) {
    const argTypes = this.argList.map(a => a.getType())
    const env = typeEnv.setIn(["types", this.id], Map({
      arguments: argTypes,
      returnType: this.getType()
    })).set("currentReturnType", this.getType())
    const envT = typeCheckEach(this.argList, env)
    const childEnv = typeCheckEach(this.children, envT)

    const errors = [this.checkReinit(typeEnv)].filter(x => x)

    return env.set("errors", childEnv.get("errors").concat(errors))
  }

  call(env, params) {
    const callEnv = env.update(
      "variables",
      (v) => v.merge(
        this.argList.reduce((a, c, i) => a.set(c.id, params[i]), Map())))

    const resultEnv = evalEach(this.children, callEnv)
    return resultEnv.update(
      "variables",
      (v) => v.deleteAll(this.argList.map(a => a.id)))
  }

  eval(env) {
    return env.setIn(["functions", this.id], this)
  }
}

class ReturnNode{
  constructor(info, expression) {
    this.info = info
    this.expression = expression
  }

  typeCheck(typeEnv) {
    const errors = this.expression.typeCheck(typeEnv).get("errors")

    return typeEnv.set(
      "errors",
      this.getType() === typeEnv.get("currentReturnType") ?
        errors : errors.push(createError("invalidReturnValue", this)))
  }

  getType() {
    return this.expression ? this.expression.getType() : "void"
  }

  eval(env) {
    return env.set("result", this.expression.eval(env).get("result"))
  }
}

function paramTypesMatches(t1, t2) {
  return t1 === t2 || assignTypesMatches(t1, t2)
}

class FunctionCallNode {
  constructor(info, id, params) {
    this.info = info
    this.id = id
    this.params = params
  }

  getType() {
    return this.type
  }

  typeCheck(typeEnv) {
    const type = typeEnv.getIn(["types", this.id])

    // TODO Fix (look at SymbolNode)
    if (!this.type && type) {
      this.type = type.get("returnType")
    }
    // TODO check that param types matches function signature
    // TODO check if assignment matches function return value
    const errors = [
      typeEnv.getIn(["types", this.id]) ?
        null : createError("functionDoesNotExist", this)
    ].filter(x => x)
    const paramEnv = typeCheckEach(this.params, typeEnv)
    const fnTypes = typeEnv.getIn(["types", this.id, "arguments"])
    const paramTypeErrors = fnTypes ? this.params.map(
      (p, i) => paramTypesMatches(p.getType(), fnTypes.get(i)) ?
        null : createError("fnParamInvalidType", p)
    ).filter(x => x) : []

    return typeEnv.set(
      "errors",
      paramEnv.get("errors").concat(
        errors, paramTypeErrors))
  }

  eval(env) {
    const fn = env.getIn(["functions", this.id])
    const paramResults = this.params.map(p => p.eval(env).get("result"))
    return fn.call(env, paramResults.toJS())
  }
}

class ArrayAccessNode {
  constructor(info, id, expression) {
    this.info = info
    this.id = id
    this.expression = expression
  }

  checkExpr() {
    return this.expression.getType() === "integer" ?
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
    const exprEnv = this.expression.typeCheck(typeEnv)
    return typeEnv.set("errors", exprEnv.concat(errors))
  }

  eval(env) {
    const arr = env.getIn(["variables", this.id])
    const index = this.expression.eval(env).get("result")
    return env.set("result", arr[index])
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
    const errors = this.expression.getType() === "boolean" ?
      [] : [createError("whileExprMustBeBool", this)]
    return typeEnv.update("errors", (e) => e.concat(
      exprErrors, errors))
  }

  eval(env) {
    // TODO Fix potential stack overflow
    if (!this.expression.eval(env).get("result"))
      return env
    else
      return this.eval(evalEach(this.body, env))
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
    const exprEnv = this.expression.typeCheck(typeEnv)
    const ifEnv = typeCheckEach(
      this.ifBody, typeEnv.set("errors", typeEnv.get("errors")))
    const elseEnv = typeCheckEach(
      this.elseBody, typeEnv.set("errors", ifEnv.get("errors")))

    const errors = this.expression.getType() === "boolean" ?
      elseEnv.get("errors") :
      elseEnv.get("errors").push(createError("ifExprMustBeBool", this))

    return typeEnv.set("errors", errors)
  }

  eval(env) {
    const r = this.expression.eval(env).get("result")
    if (r !== true &&
        r !== false)
      throw Error("Invalid comparision result")
    if (r) {
      return evalEach(this.ifBody, env)
    } else {
      return this.elseBody.isEmpty() ? env : evalEach(this.elseBody, env)
    }
  }
}

function compareTypesMatches(t1, t2) {
  return t1 === t2 || isBothNumbers(t1, t2)
}

function compare(c, v1, v2) {
  switch(c) {
    case "lt": return v1 < v2
    case "gt": return v1 > v2
    case "eq": return v1 === v2
    default: throw Error("Unknown comparision: " + c)
  }
}

class CompareNode {
  constructor(info, comparision, left, right) {
    this.info = info
    this.comparision = comparision
    this.left = left
    this.right = right
  }

  getType() {
    return "boolean"
  }

  typeCheck(typeEnv) {
    const leftEnv = this.left.typeCheck(typeEnv)
    const rightEnv = this.right.typeCheck(
      typeEnv.set("errors", leftEnv.get("errors")))
    const errors = compareTypesMatches(this.left.getType(), this.right.getType())
      ? rightEnv.get("errors") : rightEnv.get("errors").push(
        createError(
          "comparingMismatch", this))
    return typeEnv.set("errors", errors)
  }

  eval(env) {
    return env.set(
      "result",
      compare(
        this.comparision,
        this.left.eval(env).get("result"),
        this.right.eval(env).get("result")))
  }
}

const operators = {
  "add": (x, y) => x + y,
  "subtract": (x, y) => x - y,
  "div": (x, y) => x / y,
  "multiply": (x, y) => x * y
}

const isOneString = (t1, t2) =>
  t1 === "string" ||
  t2 === "string"

const typePriorities = [
  "array_integer", "boolean", "integer", "double", "string"]

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
  }

  getType() {
    return detectType(this.left.getType(), this.right.getType())
  }

  typeCheck(typeEnv) {
    const leftEnv = this.left.typeCheck(typeEnv)
    const rightEnv = this.right.typeCheck(
      typeEnv.set("errors", leftEnv.get("errors")))
    const errors = isValid(this.getType()) ?
          rightEnv.get("errors") :
          rightEnv.get("errors").push(createError("invalidArithmetics", this))
    return typeEnv.set("errors", errors)
  }

  eval(env) {
    return env.set(
      "result",
      operators[this.operator](this.left.eval(env).get("result"),
                               this.right.eval(env).get("result")))
  }
}

function assignTypesMatches(t1, t2) {
  return t1 === t2 ||
    (t1 === "double" && t2 === "integer") ||
    (t1 && t1.startsWith("array_") && t2 === "array_empty")
}

class AssignmentNode {
  constructor(info, id, expression, type) {
    this.info = info
    this.id = id
    this.expression = expression
    this.type = type
  }

  getType() {
    return this.type
  }

  checkTypeMatch(typeEnv) {
    const type = this.type ? this.type : typeEnv.getIn(["types", this.id])
    if (type) {
      return assignTypesMatches(type, this.expression.getType()) ?
        null : createError("assignExprConflict", this)
    } else {
      return createError("notInitialized", this)
    }
  }

  checkReinit(typeEnv) {
    return this.getType() && typeEnv.hasIn(["types", this.id]) ?
      createError("alreadyInitialized", this) : null
  }

  typeCheck(typeEnv) {


    const nodeTypeEnv = this.getType() ?
      typeEnv.setIn(["types", this.id], this.getType()) : typeEnv

    const exprTypeEnv = this.expression.typeCheck(nodeTypeEnv)

    const errors = [
      this.checkTypeMatch(typeEnv), this.checkReinit(typeEnv)
    ].filter(x => x)

    return exprTypeEnv.update("errors", e => e.concat(errors))
  }

  eval(env) {
    return env.setIn(["variables", this.id],
                     this.expression.eval(env).get("result"))
  }
}

class InvalidValueType {
  constructor(type, value) {
    this.type = type
    this.value = value
  }

  getType() {
    return this.type
  }
}

function isValid(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return true
    } else {
      const firstValueType = (typeof value[0])
      return value.some(x => (typeof x) !== firstValueType) === null
    }
  } else {
    return !(value instanceof InvalidValueType)
  }
}

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
  "string": (x) => {
    const start = x.startsWith("\"") ? 1 : 0
    const end = x.endsWith("\"") ? x.length -1 : x.length
    return x.substring(start, end)},
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

const arrayTypes = {
  integer: "array_integer",
  double: "array_double",
  string: "array_string",
  boolean: "array_boolean"
}

const getArrayType = (a) => a.size === 0 ?
      "array_empty" : arrayTypes[a.first().getType()]

class ValueNode {
  constructor(info, type, value) {
    this.info = info
    if (type === "array") {
      this.type = getArrayType(value)
      this.value = value
    } else {
      this.type = type
      this.value = parseValue(this.type, value)
    }
  }

  getType() {
    return this.type
  }

  typeCheck(typeEnv) {
    return isValid(this.value) ?
      typeEnv : typeEnv.update(
        "errors", v => v.push(createError("invalidType", this)))
  }

  getValue() {
    if (this.type.startsWith("array_"))
      return this.value.map(v => v.value).toJS()
    else
      return this.value
  }

  eval(env) {
    return env.set("result", this.getValue())
  }
}

class SymbolNode {
  constructor(info, id) {
    this.info = info
    this.id = id
  }

  getType() {
    return this.type
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
        "errors", e => e.push(createError("symbolDoesNotExist", this)))
  }

  eval(env) {
    return env.set("result", env.getIn(["variables", this.id]))
  }
}

class ArgumentNode {
  constructor(info, type, id) {
    this.info = info
    this.type = type
    this.id = id
  }

  getType() {
    return this.type
  }

  typeCheck(typeEnv) {
    return typeEnv.setIn(["types", this.id], this.type)
  }

  eval(env) {
    throw Error("Evaluation of argument is not supported yet")
  }
}

function createSystemFunction(id, customCall, args, returnType) {
  const fn = new FunctionNode(Map(), id, List(), List(args), returnType)
  fn.call = (env, params) => customCall(fn, env, params)
  return fn
}

const systemFunctions = List([
  createSystemFunction(
    "print",
    (_this, env, params) =>  {
      console.log.apply(console, params)
      return env
    },
    [new ArgumentNode(Map(), "string", "x")],
    "void"),
  createSystemFunction(
    "d_to_str",
    (_this, env, params) =>  {
      return env.set("result", String(params[0]))
    },
    [new ArgumentNode(Map(), "double", "x")],
    "string"),
  createSystemFunction(
    "to_str",
    (_this, env, params) =>  {
      return env.set("result", String(params[0]))
    },
    [new ArgumentNode(Map(), "integer", "x")],
    "string"),
  createSystemFunction(
    "len_ai",
    (_this, env, params) =>  {
      return env.set("result", params[0].length)
    },
    [new ArgumentNode(Map(), "array_integer", "x")],
    "integer"),
  createSystemFunction(
    "len_as",
    (_this, env, params) =>  {
      return env.set("result", params[0].length)
    },
    [new ArgumentNode(Map(), "array_string", "x")],
    "integer"),
])

module.exports = {
  generateNode, ValueNode, CompareNode, ArithmeticsNode, IfNode, AssignmentNode,
  RootNode, FunctionNode, WhileNode, ArrayAccessNode, FunctionCallNode,
  ReturnNode, ArgumentNode, SymbolNode
}
