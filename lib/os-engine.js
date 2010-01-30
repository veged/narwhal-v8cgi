exports.process = new (system.v8cgi.require('process').Process)();

exports.exit = function(status) {
    return exit(status);
}

exports.status = function (command) {
    command = buildCommand(command);
    return exports.process.system(command);
};

exports.command = function (command) {
    command = buildCommand(command);
    return exports.process.exec(command)
};

exports.enquote = function (word) {
    return "'" + String(word).replace(/'/g, "'\"'\"'") + "'";
};

function buildCommand(command) {
    Array.isArray(command) && (command = command.map(function (a) { return exports.enquote(a) }).join(' '));
    return command;
}
