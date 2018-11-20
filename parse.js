if (!process.argv[2]) {
  console.log("No source file given")
  return 1;
}

const parser = require('./emcee.js');
const fs = require('fs');
const path = require('path');
const file = path.normalize(process.argv[2]);
const source = fs.readFileSync(file, "utf8");

try {
  const result = parser.parse(source);
  console.log("OK");
} catch(err) {
  console.log(err.message);
}
