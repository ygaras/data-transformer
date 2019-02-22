module.exports = function(input, options) {
  // TODO Add parameters check and usage messages
  var output = Object.assign({}, input);
  function properCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
  
  options.source.forEach((fieldName) => {
    output[fieldName] = properCase(input[fieldName]);
  });
  
  return output;
}