module.exports = function(input, options) {
  // TODO Add parameters check and usage messages
  // TODO handle fields with spaces in them, to handle such fields, use _
  
  function interpolate(template, params) {
    let names = Object.keys(params);
    names = names.map((name) => { return name.replace(' ', '_')})
    const vals = Object.values(params);
    var parsed = new Function(...names, `return \`${template}\`;`);
    var result = parsed(...vals);
    return result;
  }
  
  var output = Object.assign({}, input);
  let template = options.format;
  output[options.target] = interpolate(options.format, input);
  return output;
}