"use strict"

const {generateNode} = require("./ast.js")

function createNode(nodeType, children, id, meta) {
  return generateNode({nodeType, children, id, meta})
}

function appendChild(children, x) {
  return children.concat(x)
}

function prependChild(children, x) {
  return [x].concat(children)
}

function appendNodeChild(node, child) {
  return Object.assign(
    node,
    {children: appendChild(node.children, child)})
}

function addElse(ifNode, elseBody) {
  ifNode.elseBody = elseBody
}

module.exports = {
  createNode, appendChild, prependChild, appendNodeChild, addElse
}
