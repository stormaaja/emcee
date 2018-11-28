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
  case "argument": {
    return new ArgumentNode(id, meta.valueType)
  }
  case "assignment": {
    return new AssignmentNode(id, children[1], meta.valueType)
  }
  case "compare_gt": {
    return new CompareNode("gt", children[0], children[1])
  }
  case "if": {
    return new IfNode(children[0], children[1])
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

class WhileNode {
  constructor(expression, block) {
    this.expression = expression
    this.block = block
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
    this.right
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
