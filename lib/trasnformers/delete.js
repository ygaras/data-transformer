module.exports = function(input, options) {
  // TODO Add parameters check and usage messages
  var output = Object.assign({}, input);
  options.source.forEach((fieldName) => {
    delete output[fieldName];
  });
  return output;
}