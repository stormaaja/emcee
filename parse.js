if (!process.argv[2]) {
  console.log("No source file given")
  return 1;
}

const jison = require("jison");
const fs = require('fs');
const path = require('path');
const file = path.normalize(process.argv[2]);
const source = fs.readFileSync(file, "utf8");
const bnf = fs.readFileSync("emcee.jison", "utf8");

try {
  const parser = new jison.Parser(bnf);
  const result = parser.parse(source);
  console.log("OK");
} catch(err) {
  console.log(err.message);
}
