"use strict"

function createNode(nodeType, children, id, meta) {
  return {nodeType, children, id, meta}
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
  createNode, appendChild, prependChild, appendNodeChild
}
