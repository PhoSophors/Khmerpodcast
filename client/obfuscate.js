const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

fs.readdirSync('src').forEach(file => {
  const filePath = `src/${file}`;
  const fileContent = fs.readFileSync(filePath, 'UTF-8');

  const obfuscationResult = JavaScriptObfuscator.obfuscate(fileContent, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    numbersToExpressions: true,
    simplify: true,
    shuffleStringArray: true,
    splitStrings: true,
    stringArrayThreshold: 0.75
  });

  fs.writeFileSync(`dist/${file}`, obfuscationResult.getObfuscatedCode());
});