const parse = require('csv-parse'),
  fs = require('fs'),
  streamTransform = require('stream-transform'),
  log = require('./lib/util/logger').getLogger('transformer');

function prettyJson(inputJson) {
  return JSON.stringify(inputJson, null, 2);
}


module.exports.transform = (inputFile, outputFile, optionsFile, done) => {
  var options = JSON.parse(fs.readFileSync(optionsFile));
  
  const parser = parse({
    delimiter: ',',
    columns : true
  });
  
  
  const readStream = fs.createReadStream(inputFile),
    writeStream = fs.createWriteStream(outputFile);
  
  let headerWritten = false;
  const streamTransformer = streamTransform(function(record, callback) {
    options.transformations.forEach((transformation) => {
      // TODO add trace level logs to help with authoring the config file
      // TODO add error handling for transformers
      
      if (options.enableTrace) {
        log.d(`About to apply transformation: ${transformation.name} with config ${prettyJson(transformation.parameters)}`);
        log.d(`Before: ${prettyJson(record)}`);
      }
      
      record = require('./lib/trasnformers/' + transformation.name)(record, transformation.parameters);
      
      if (options.enableTrace) {
        log.d(`after: ${prettyJson(record)}`);
      }
    });
    
    var data = '\n' + Object.values(record).join(',');
    if (!headerWritten) {
      data = Object.keys(record).join(',') +  data;
      headerWritten = true;
    }
    writeStream.write(data);
  });
  
  streamTransformer.on('finish', function() {
    writeStream.close();
    done();
  });
  
  
  readStream.pipe(parser).pipe(streamTransformer).pipe(writeStream);
}