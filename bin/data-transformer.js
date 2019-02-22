#!/usr/bin/env node
'use strict';

const program = require('commander');
program
  .version('0.0.1')
  .option('-i, --input <file>','input csv file')
  .option('-o, --output <file>','output csv file')
  .option('-t, --transformations <file>','json file with transformations to be applied')
  .parse(process.argv); // end with parse to parse through the input

if (process.argv.length !== 8) {
  program.help();
}

require('../index').transform(program.input, program.output, program.transformations, () => {});