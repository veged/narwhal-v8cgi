// Logging
// 
// FATAL:   an unhandleable error that results in a program crash
// ERROR:   a handleable error condition
// WARN:    a warning
// INFO:    generic (useful) information about system operation
// DEBUG:   low-level information for developers
// (Stolen from Ruby)
//

var system = require("system"),
    file = require("file");

var Logger = exports.Logger = function(output) {
    if (typeof output === "string")
        this.output = file.open(output, "a");
    else if (typeof output === 'undefined')
        this.output = { write: system.print };
    else this.output = { write: function(s) { output(s) } };

    this.level = Logger.INFO;
};

Logger.SEV_LABEL = ["FATAL", "ERROR", "WARN" , "INFO" , "DEBUG"];

Logger.SEV_LABEL.forEach(function(label, severity) {
    Logger[label] = severity;
    Logger.prototype[label.toLowerCase()] = function() {
        return this.add(severity, this.format(severity, arguments));
    };
});

Logger.prototype.add = function(severity, message, progname) {
    if (severity > this.level)
        return false;
    this.output.write(message || progname);
};

Logger.prototype.format = function(severity, args) {
    return new Date() + " ["+Logger.SEV_LABEL[severity].toLowerCase()+"] " +Array.prototype.join.apply(args, [" "]).replace(/\n/g, "");
};
