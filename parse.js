const jison = require("jison");
const fs = require('fs');
const path = require('path');

if (process.length < 3) {
  console.log("No source file given")
  return 1;
}

function loadFile(filePath) {
  const file = path.normalize(filePath);
  const source = fs.readFileSync(filePath, "utf8");
  return source;
}

const bnf = fs.readFileSync("emcee.jison", "utf8");
const parser = new jison.Parser(bnf);

function parseFile(file) {
  const source = loadFile(file);
  let success = true;
  let result;

  try {
    const parseResult = parser.parse(source);
    result = parseResult;
  } catch(err) {
    success = false;
    result = err;
  }

  return {"file": file, "success": success, "result": result};
}

function printGreen(text) {
  console.log("\x1b[32m%s\x1b[32m", text);
}

const files = process.argv.slice(2);
const results = files.map(parseFile);
results.forEach(r => {
  if (r.success) {
    console.log("%s: \x1b[32mOK\x1b[0m", r.file);
  } else {
    console.log("%s: \x1b[31mFail\x1b[0m", r.file);
    console.log(r.result.message);
  }
})
return 0;
