const fs = require('fs'),
  transformer = require('../index'),
  log = require('../lib/util/logger').getLogger('Test');


fs.readdir(__dirname + '/fixtures', (err, files) => {
  files.forEach(file => {
    runTest(file);
  });
});

function runTest(test) {
  
  let testPath = __dirname + '/fixtures/' + test + '/',
    configFile = testPath + 'config.json',
    inputFile = testPath + 'input.csv',
    expectedFile = testPath + 'expected.csv',
    actual = testPath + 'actual.csv';
  
  transformer.transform(inputFile, actual, configFile, (err) => {
    let outputFileContent = fs.readFileSync(actual, {encoding : 'utf8'}),
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

actual:
${outputFileContent}

      `);
      process.exit(1);
    } else {
      log.d(`${test} TEST PASSED`);
    }
    
    
  });
  
}

