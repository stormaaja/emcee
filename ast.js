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
  default: {
    return {}
  }
  }
}

class RootNode {
  constructor(children) {
    this.children = children.map(generateNode)
  }
}

class FunctionNode {
  constructor(id, children, meta) {
    this.id = id
    this.children = children.map(generateNode)
    this.returnType = meta.returnType
    this.argList = meta.argList
  }
}

class ReturnNode{
  constructor(expression) {
    this.expression = expression ?
      generateNode(expression) : new ValueNode("void")
  }
}

class FunctionCallNode {
  constructor(id, params) {
    this.id = id
    this.params = params.map(generateNode)
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
  constructor(expression, ifBlock, elseBlock) {
    this.expression = expression
    this.ifBlock = ifBlock
    this.elseBlock = elseBlock
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
  constructor(id, value, type) {
    this.id = id
    this.value = value
    this.type = type
  }
}

class ValueNode {
  constructor(type, value) {
    this.type = type
    this.value = value
  }
}

module.exports = {generateNode, RootNode, FunctionNode, ValueNode, ReturnNode}
