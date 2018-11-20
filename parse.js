const parse = require('./emcee.js').parse;
const fs = require('fs');
const path = require('path');
const file = path.normalize(process.argv[2]);
const source = fs.readFileSync(file, "utf8");

try {
  const result = parse(source);
  console.log("OK");
} catch(err) {
  console.log(err.message);
}
