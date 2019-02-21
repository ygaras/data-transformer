"use strict";
module.exports = function(input, options) {
  // TODO Add parameters check and usage messages
  var output = Object.assign({}, input);
  for (var i = 0; i < options.source.length; i++) {
    output[options.target[i]] = input[options.source[i]];
    delete  output[options.source[i]];
  }
  return output;
}