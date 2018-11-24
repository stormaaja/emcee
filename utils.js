function createNode(nodeType, children, id, meta, expr) {
  return { nodeType, children, id, meta, expr};
}

function appendNode(children, x) {
  return [x].concat(children);
}

function createReturn(expr) {
  return createNode(
    "return", [], undefined, {}, expr);
}

function createFunction(children, id, returnType, argList) {
  return createNode("function", children, id, {returnType, argList});
}

function createComparision(comparisionType, left, right) {
  return createNode(
    "comparision", [], undefined, {left, right, comparisionType});
}

function createFnCall(id, params) {
  return createNode("fn_call", [], id, {params});
}

module.exports = {
  createNode, appendNode, createFunction, createComparision, createFnCall
}
