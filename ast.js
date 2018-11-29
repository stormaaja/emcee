"use strict"

function generateNode({nodeType, children, id, meta}) {
  switch (nodeType) {
  case "root": {
    return new RootNode(children)
  }
  case "function": {
    return new FunctionNode(id, children, meta)
  }
  case "function_call": {
    return new FunctionCallNode(id, children)
  }
  case "return": {
    return new ReturnNode(children[0])
  }
  case "string_value": {
    return new ValueNode("string", children[0])
  }
  case "integer_value": {
    return new ValueNode("integer", children[0])
  }
  case "double_value": {
    return new ValueNode("double", children[0])
  }
  case "array_values": {
    return new ValueNode("array", children)
  }
  case "array_access": {
    return new ArrayAccessNode(id, children[0])
  }
  case "argument": {
    return new ArgumentNode(id, meta.valueType)
  }
  case "assignment": {
    return new AssignmentNode(id, children[1], meta.valueType)
  }
  case "compare_gt": {
    return new CompareNode("gt", children[0], children[1])
  }
  case "compare_lt": {
    return new CompareNode("lt", children[0], children[1])
  }
  case "compare_eq": {
    return new CompareNode("eq", children[0], children[1])
  }
  case "if": {
    return new IfNode(children[0], children[1])
  }
  case "while": {
    return new WhileNode(children[0], children[1])
  }
  case "add_expr": {
    return new ArithmeticsNode("add", children[0], children[1])
  }
  case "sub_expr": {
    return new ArithmeticsNode("subtract", children[0], children[1])
  }
  case "mul_expr": {
    return new ArithmeticsNode("multiply", children[0], children[1])
  }
  case "div_expr": {
    return new ArithmeticsNode("div", children[0], children[1])
  }

  default: {
    throw Error("Unknown node type: " + nodeType)
  }
  }
}

class RootNode {
  constructor(children) {
    this.children = children
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
}

class CompareNode {
  constructor(comparision, left, right) {
    this.comparision = comparision
    this.left = left
    this.right = right
  }
}

class ArithmeticsNode {
  constructor(operator, left, right) {
    this.operator = operator
    this.left = left
    this.right = right
  }
}

class AssignmentNode {
  constructor(id, expression, type) {
    this.id = id
    this.expression = expression
    this.type = type
  }
}

class ValueNode {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

class ArgumentNode{
  constructor(type, id) {
    this.type = type
    this.id = id
  }
}

module.exports = {
  generateNode
}
