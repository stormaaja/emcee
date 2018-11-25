const parser = require('../parser.js');
const {createNode} = require('../utils.js')

function generateMain(block) {
  return `int main() { ${block} }`
}

test("generates AST for if", () => {
  const source = generateMain("if (2 > 1) {return 0;} return 1;")
  expect(parser.parse(source).result).toEqual(
    createNode("root", [
        createNode("function", [
          createNode("if", [
            createNode("return", [], null, {}, "0")
          ], null, {}, createNode("compare_gt", ["2", "1"])),
          createNode("return", [], null, {}, "1")
        ], "main", {argList: [], returnType: "int"})
    ])
  )
})