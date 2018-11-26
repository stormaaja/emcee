"use strict"

function createNode(nodeType, children, id, meta, expr) {
  return { nodeType, children, id, meta, expr }
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

module.exports = {
  createNode, appendChild, prependChild, appendNodeChild
}
