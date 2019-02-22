# data-transformer


[![Build Status](https://travis-ci.com/ygaras/data-transformer.svg?branch=master)](https://travis-ci.com/ygaras/data-transformer)


Data transformer applies series of transformations on csv files to change it from one formate to another. It uses [CSV Parse](https://github.com/adaltas/node-csv-parse) for parsing the csv data using nodejs [Streams](https://nodejs.org/api/stream.html) allowing it to deal with large amount of data effictively. 

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
$ npm install git+https://git@github.com/ygaras/data-transformer
```

# Usage
You can clone the repo to make it easier to access the tests and see variaus examples of how to transform data
```
$ git clone https://github.com/ygaras/data-transformer.git && cd  data-transformer && npm install
$ npm test
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
The previous transformation instructs data-transformer to rename columns "product id" and "product price" to "ProductId", "ProductPrice" respectively. 

