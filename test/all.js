const fs = require('fs'),
  transformer = require('../index'),
  log = require('../lib/util/logger').getLogger('Test');


fs.readdir(__dirname + '/fixtures', (err, files) => {
  files.forEach(file => {
    runTest(file);
  });
});

function runTest(test) {
  log.d('Running test ' + test);
  let testPath = __dirname + '/fixtures/' + test + '/',
    configFile = testPath + 'config.json',
    inputFile = testPath + 'input.csv',
    expectedFile = testPath + 'expected.csv',
    outputFile = __dirname + '/' + 'output.csv';
  
  transformer.transform(inputFile, outputFile, configFile, (err) => {
    let outputFileContent = fs.readFileSync(outputFile, {encoding : 'utf8'}),
      expectedFileContent = fs.readFileSync(expectedFile, {encoding : 'utf8'}),
      configFileContent = fs.readFileSync(configFile),
      inputFileContent = fs.readFileSync(inputFile);
    
    
    if (outputFileContent !== expectedFileContent) {
      log.d(`${test} FAILED:
      
input:
${inputFileContent}

config:
${configFileContent}

expected:
${expectedFileContent}

output:
${outputFileContent}

      `);
      process.exit(1);
    } else {
      log.d("Test PASSED");
    }
    
    
  });
  
}

