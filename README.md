<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
- [Configuration Syntax](#configuration-syntax)
- [TODO](#todo)
- [Technology Choices](#technology-choices)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# data-transformer

[![Build Status](https://travis-ci.com/ygaras/data-transformer.svg?branch=master)](https://travis-ci.com/ygaras/data-transformer)

Data transformer applies series of transformations on csv files to change it from one format to another. It uses [CSV Parse](https://github.com/adaltas/node-csv-parse) for parsing the csv data using nodejs [Streams](https://nodejs.org/api/stream.html) allowing it to deal with large amount of data efficiently. 

# Installation
data-transformer can be used as a command line tool or as an npm module. The module was developed and tested using node.js v10.15.1. For global command line installation:

```
$ npm install -g git+https://git@github.com/ygaras/data-transformer
$ data-transformer 
Usage: data-transformer [options]

Options:
  -V, --version                 output the version number
  -i, --input <file>            input csv file
  -o, --output <file>           output csv file
  -t, --transformations <file>  json file with transformations to be applied
  -h, --help                    output usage information
```  
  
To install the npm module locally to a project:

```
$ npm install --save git+https://git@github.com/ygaras/data-transformer
```
The exported transform requires the pathes for the input csv file, output csv file and the configuration holding the transformations.
```
const dataTransformer = require('data-transformer');
dataTransformer.transform('input.csv', 'output.csv', 'options.json', (err, result) => {
    if(err) console.warn(err);
    console.log(result);
})
```

# Usage
You can clone the repo to make it easier to access the tests and see various examples of how to transform data.
```
$ git clone https://github.com/ygaras/data-transformer.git && cd  data-transformer && npm install
$ npm test

> data-transformer@0.0.1 test /Users/ygaras/git/temp/data-transformer
> node test/all.js

2019-02-22T13:58:43.569Z DEBUG validate: value failedValidation1 is not not a valid Int, entire record will be skipped
2019-02-22T13:58:43.570Z DEBUG validate: value 2019-30-11 is not a valid DateTime, entire record will be skipped
2019-02-22T13:58:43.570Z DEBUG transformer: Input data will be skipped ID6768,failedValidation1,2019-30-11,13.02
2019-02-22T13:58:43.570Z DEBUG validate: value 2019-30-11 is not a valid DateTime, entire record will be skipped
2019-02-22T13:58:43.570Z DEBUG transformer: Input data will be skipped ID6768,10,2019-30-11,13.02
2019-02-22T13:58:43.570Z DEBUG validate: value failedValidation2 is not not a valid Float, entire record will be skipped
2019-02-22T13:58:43.570Z DEBUG transformer: Input data will be skipped ID6768,30,2019-11-30,failedValidation2
2019-02-22T13:58:43.575Z DEBUG Test: add TEST PASSED
2019-02-22T13:58:43.576Z DEBUG Test: delete TEST PASSED
2019-02-22T13:58:43.577Z DEBUG Test: etl TEST PASSED
2019-02-22T13:58:43.577Z DEBUG Test: proper-case TEST PASSED
2019-02-22T13:58:43.578Z DEBUG Test: rename TEST PASSED
2019-02-22T13:58:43.578Z DEBUG Test: validate TEST PASSED
```
Run a rename transformation
```
$ cat test/fixtures/rename/input.csv
product id,product price
ID6768, 99.99
ID67238, 99.92
$ cat test/fixtures/rename/config.json 
{
  "transformations" : [
    {
      "name" : "rename",
      "parameters" : {
        "source" : ["product id", "product price"],
        "target" : ["ProductId", "ProductPrice"]
      }
    }
  ]
$ node bin/data-transformer -i test/fixtures/rename/input.csv -t test/fixtures/rename/config.json -o /dev/stdout
ProductId,ProductPrice
ID6768, 99.99
ID67238, 99.92
```
The previous transformation instructs data-transformer to rename columns "product id" and "product price" to "ProductId" and "ProductPrice" respectively. 

# Configuration Syntax
**WARNNING**: Don't process a configuration file from an untrusted source. The module is vulnerable to a remote code execution exploit. 
Below is a list of all possible transformations and configuration options.

**enableTrace**: Set it to true while authoring your transformations. It will output debug messages as transformations are applied from one stage to another. Transformations are applied sequentially, so the output of one transformation is the input to the next one. If a field is deleted in a certain transformation, it will no longer be available to the following transformer.

**rename**: Renames column names.
add: Adds one new field with the specified target name. The format string is executed directly as a [template literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) taking values from input columns. This can be exploited to execute arbitrary code.

**delete**: Removes columns.

**proper-case**: Format the column value to be a proper cased string.

**validate**: Makes sure row values can be parsed as valid data types. If a row fails validation, messages will be logged and the transformation will continue to next row.

```
$ cat test/fixtures/etl/config.json 
{
  "enableTrace" : false,
  "transformations" : [
    {
      "name" : "rename",
      "parameters" : {
        "source" : ["Order Number", "Product Number", "Count", "Product Name"],
        "target" : ["OrderID", "ProductId", "Quantity", "ProductName"]
      }
    },
    {
      "name" : "add",
      "parameters" : {
        "target" : "OrderDate",
        "format" : "${Year}-${Month}-${Day}"
      }
    },
    {
      "name" : "add",
      "parameters" : {
        "target" : "Unit",
        "format" : "kg"
      }
    },
    {
      "name" : "delete",
      "parameters" : {
        "source" : ["Year","Month","Day","Extra Col1","Extra Col2","Empty Column"]
      }
    },
    {
      "name" : "proper-case",
      "parameters" : {
        "source" : ["ProductName"]
      }
    },
    {
      "name" : "validate",
      "parameters" : {
        "source" : ["OrderID", "OrderDate", "ProductId", "ProductName", "Quantity", "Unit"],
        "type" : ["Int", "DateTime", "String", "String", "Float", "String"]
      }
    }
  ]
}
```

# TODO
1. Better parsing and validation of input data. Dates and numbers parsing should be done by libraries or modules created for the job, moment.js for Dates, something similar for integers and decimals.
1. Input validation and parameters checking for each transformer.
1. Get rid of input that is used in JavaScript template literal. This is very dangerous and allows remote code execution.
1. Add convenience API that accepts streams or json data instead of file paths.
1. Handle field names with spaces.
1. The validation transformer needs to be rewritten.


#Architecture
Data-transformer has a simple and a straight forward architecture. Each transformer is a nodejs module that exports a function that receives a json object with column names and row values and a parameter object that has parameters specific to this transformer. The simplest 'noop' transformer would be:

```
module.exports = function(input, options) {
  return input;
}
```
And a config file to load such a transformer would be:
```
{

  "transformations" : [
    {
      "name" : " noop"
    }
}

```
Check ```lib/transformers/``` to see how existing transformers are implemented. The engine in index.js loads the json config file and creates read streams of the input csv and a write stream for the output csv file. Each record read, is read as a json object. Transformers defined in the config file are loaded one after the other, passed the defined parameters and the input json object holding the data. The output of each transformer is provided as an input to the following transformer till all transformers defined in the config are consumed. If one transformer fails to parse certain row, the failed transformer, transformer parameters and input data will be logged and execution will continue to the next row.

# Technology Choices
Node.js is a good tool to quickly have such a project functioning. It also natively supports json which saves a lot of boilerplate code.  Node.js stream is also a good fit since it efficiently allows dealing with large data and it can easily be changes to read from or write to any other data store like a database or some remote store. 
