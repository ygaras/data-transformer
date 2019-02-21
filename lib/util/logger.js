function format(level, name, message) {
  var date = new Date();
  return `${(new Date()).toUTCString()} ${level} ${name}: ${message}`
}

class Logger {
  constructor(name, options) {
    this.name = name;
    this.options = options;
  }

  d(message) {
    console.log(format('DEBUG', this.name, message));
  }
  
  w(message) {
    console.warn(format('WARN', this.name, message));
  }
}

module.exports.getLogger = function(name, options) {
  return new Logger(name, options);
}