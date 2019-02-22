const fs = require('fs'),
  transformer = require('../index'),
  assert = require('assert'),
  log = require('../lib/util/logger').getLogger('Test');




runTransformertsTest();
// Test processing a very large file, uncomment the line below to run the test. Takes a while to run.
// testLargeFile();
function testLargeFile() {
  var largeFile = 'largeFile.csv',
    largeFileOut = 'largeFileOut.csv',
    configFile = __dirname + '/fixtures/etl/config.json',
    records = 1000 * 1000,
    header = "Order Number,Year,Month,Day,Product Number,Product Name,Count,Extra Col1,Extra Col2,Empty Column",
    row = "\n1001,2017,12,12,P-10002,Iceberg lettuce,500.00,Lorem,Ipsum,"
  
  if (fs.existsSync(largeFile)) fs.unlinkSync(largeFile);
  if (fs.existsSync(largeFileOut)) fs.unlinkSync(largeFileOut);
  
  
  fs.appendFileSync(largeFile, header);
  var i = records;
  while (i-- > 0) fs.appendFileSync(largeFile, row);
  
  transformer.transform(largeFile, largeFileOut, configFile, (err, actualProgress) => {
    "use strict";
    var expectedProgress = {
      read : records, written : records, skipped : 0
    }
    assert.deepStrictEqual(expectedProgress, actualProgress, 'Failed to transform large file');
    fs.unlinkSync(largeFile);
    fs.unlinkSync(largeFileOut);
    // runTransformertsTest();
  });
  
}

function runTransformertsTest() {
  fs.readdir(__dirname + '/fixtures', (err, files) => {
    files.forEach(file => {
      runTest(file);
    });
  });
  
}
// TODO add test for large csv file
function runTest(test) {
  let testPath = __dirname + '/fixtures/' + test + '/',
    configFile = testPath + 'config.json',
    inputFile = testPath + 'input.csv',
    expectedFile = testPath + 'expected.csv',
    actual = testPath + 'actual.csv';
  
  transformer.transform(inputFile, actual, configFile, (err) => {
    let actualFileContent = fs.readFileSync(actual, {encoding : 'utf8'}),
      expectedFileContent = fs.readFileSync(expectedFile, {encoding : 'utf8'}),
      configFileContent = fs.readFileSync(configFile),
      inputFileContent = fs.readFileSync(inputFile);
    
    if (actualFileContent != expectedFileContent) {
      log.d(`${test} FAILED:
      
input:
${inputFileContent}

config:
${configFileContent}

expected:
${expectedFileContent}

actual:
${actualFileContent}

      `);
      process.exit(1);
    } else {
      log.d(`${test} TEST PASSED`);
    }
    fs.unlinkSync(actual);
    
  });
  
}