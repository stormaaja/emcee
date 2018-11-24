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

function parseSource(parser, source) {
  try {
    return {success: true, result: parser.parse(source)};
  } catch(err) {
    return {success: false, result: err};
  }
}

function parseFile(file) {
  const parser = new jison.Parser(bnf);
  const source = loadFile(file);

  return Object.assign(
    {file, parser}, parseSource(parser, source)
  );
}

function printGreen(text) {
  console.log("\x1b[32m%s\x1b[32m", text);
}

const args = process.argv.slice(2);
const files = args.filter(f => !f.startsWith("--"));
const options = args.filter(f => f.startsWith("--"))

const printTree = options.includes("--print-tree");

const results = files.map(parseFile);

results.forEach(r => {
  if (r.success) {
    console.log("%s: \x1b[32mOK\x1b[0m", r.file);
    if (printTree) {
      console.log(JSON.stringify(r.result, null, 2));
    }
  } else {
    console.log("%s: \x1b[31mFail\x1b[0m", r.file);
    console.log(r.result.message);
  }
})
return 0;
