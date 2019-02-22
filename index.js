const parse = require('csv-parse'),
  fs = require('fs'),
  streamTransform = require('stream-transform'),
  log = require('./lib/util/logger').getLogger('transformer');

function prettyJson(inputJson) {
  return JSON.stringify(inputJson, null, 2);
}

// TODO add convenience API that accepts actual data instead of files
// TODO add stats about number of records imported and update console for large data sets
// TODO add test for large data set
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
    let inputRecord = record;
    for (var transformationKey in options.transformations) {
      var transformation = options.transformations[transformationKey];
      if (options.enableTrace) {
        log.d(`About to apply transformation: ${transformation.name} with config ${prettyJson(transformation.parameters)}`);
        log.d(`Before ${transformation.name} ${prettyJson(record)}`);
      }
      
      try {
        record = require('./lib/trasnformers/' + transformation.name)(record, transformation.parameters);
      } catch (exception) {
        log.w(`Transformer ${transformation.name} failed with options \n ${prettyJson(transformation.parameters)} failed for input \n ${prettyJson(record)}`);
        log.w(exception);
        record = null;
        break;
      }
  
      if (options.enableTrace) {
        log.d(`After ${transformation.name}  ${prettyJson(record)}`);
      }
    }
    if (typeof record == 'object' && record != null) {
      var data = '\n' + Object.values(record).join(',');
      if (!headerWritten) {
        data = Object.keys(record).join(',') +  data;
        headerWritten = true;
      }
      callback(null, data);
      // writeStream.write(data);
    } else {
      log.d(`Input data will be skipped ${Object.values(inputRecord).join(',')}`);
      callback(null, null);
    }
    
  });
  
  parser.on('error', function (error) {
    log.w(`Failed to parse file ${inputFile}`);
    log.w(error);
    done();
  });
  
  // streamTransformer.on('finish', function() {
  //   writeStream.close();
  //   done();
  // });
  
  
  writeStream.on('finish', done);
  readStream.pipe(parser).pipe(streamTransformer).pipe(writeStream);
}

