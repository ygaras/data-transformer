const log = require('../util/logger').getLogger('validate');

module.exports = function(input, options) {
  // TODO Add parameters check and usage messages
  // TODO Check for stronger validation
  // TODO break it down to so that each type is validated in its own function
  
  var output = Object.assign({}, input);
  var passed = true;
  options.source.forEach((fieldName, index) => {
    if (options.type[index] === 'DateTime') {
      let result = new Date(Date.parse(input[fieldName]));
      if (isNaN(result)) {
        log.d(`value ${input[fieldName]} is not a valid DateTime, entire record will be skipped`);
        passed = false;
      } else {
        var localTimezoneOffset = result.getTimezoneOffset() * 60000;
        output[fieldName] = new Date(result.getTime() - localTimezoneOffset).toISOString();
      }
    } else if (options.type[index] === 'Int') {
      let result = parseInt(input[fieldName]);
      output[fieldName] = result;
      if (isNaN(result)) {
        log.d(`value ${input[fieldName]} is not not a valid Int, entire record will be skipped`);
        passed = false;
      }
    } else if (options.type[index] === 'Float') {
      let result = parseFloat(input[fieldName]);
      output[fieldName] = result;
      if (isNaN(result)) {
        log.d(`value ${input[fieldName]} is not not a valid Float, entire record will be skipped`);
        passed = false;
      }
    } else if (options.type[index] === 'String') {
      let result = (typeof input[fieldName]) == 'string';
      if (!result) {
        log.d(`value ${input[fieldName]} is not not a valid String, entire record will be skipped`);
        passed = false;
      }
    } else {
      log.w(`Type ${options.type[index]} is not a supported type`);
    }
  });
  
  return passed ? output : null;
}