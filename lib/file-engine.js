
var exports = require('./file'),
    os = require('os');

exports.SEPARATOR = '/';

exports.cwd = function () {
    return system.getcwd();
};

// TODO necessary for package loading
exports.list = function (path) {
    var d = new Directory(path);
    return d.listFiles().concat(d.listDirectories()).sort();
};

// TODO necessary for package loading
exports.canonical = function (path) {
    return (exports.isAbsolute(path) ? '' : system.getcwd() + '/') + path;
};

exports.open = function(path, mode) { return new File(path).open(mode) }

exports.read = function(path){
    var file = new File(path).open('r'),
        res = file.read();
    file.close();
    return res;
}; // function(path:string):string


exports.exists = function (path) {
    return new File(path).exists()
};

// TODO necessary for lazy module reloading in sandboxes
exports.mtime = function (path) {
    return exports.stat(path).mtime;
};

exports.size = function (path) {
    return exports.stat(path).size;
};

exports.stat = function (path) {
    return new File(path).stat()
};

// TODO necessary for package loading
exports.isDirectory = function (path) {
    return new Directory(path).isDirectory();
};

exports.isFile = function(path){ return new File(path).isFile() }; // function(path:string):boolean

exports.linkExists = function (path) {
    return exports.isLink(path) || exports.exists(path);
};

exports.isLink = function (path) {
    // FIXME hack
    return os.command("bash -c 'if [ -L " + path + " ]; then echo '1'; else echo '0'; fi'") == 1;
};

exports.isReadable = function (path) {
    throw Error("isReadable not yet implemented.");
};

exports.isWritable = function (path) {
    // FIXME hack
    return os.command("bash -c 'if [ -w " + path + " ]; then echo '1'; else echo '0'; fi'") == 1;
};

exports.chmod = function (path, mode) {
    if (!/\bwindows\b/i.test(system.os))
        os.command(['chmod', mode.toString(8), path]);
    // XXX Windows code-path
};

exports.link = function (source, target) {
    os.command(['ln', source, target]);
};

exports.symlink = function (source, target) {
    if (exports.isRelative(source))
        source = exports.relative(target, source);
    os.command(['ln', '-s', source, target]);
};


exports.rename = exports.move = function (source, target) {
    new File(source).move(target);
};

exports.remove = function (path) {
    new File(path).remove();
};

exports.mkdir = function (path) {
    new Directory(path).create();
};

exports.mkdirs = function (path) {
    os.command(['mkdir', '-p', path]);
};

exports.rmdir = function(path) {
    new Directory(path).remove();
};

exports.touch = function (path, mtime) {
    new File(path).open('w').write('').close();
};

exports.FileIO = function (path, mode, permissions) {
    mode = exports.mode(mode);
    var read = mode.read,
        write = mode.write,
        append = mode.append,
        update = mode.update;

    if (update) {
        throw new Error("Updating IO not yet implemented.");
    } else if (write || append) {
        var f = new File(path).open(mode);
        return {
            write: function(data) { return f.write(data) },
            close: function() { f.close() }
        };
    } else if (read) {
        var f = new File(path).open(mode);
        return {
            read: function() { return f.read() },
            close: function() { f.close() }
        };
    } else {
        throw new Error("Files must be opened either for read, write, or update mode.");
    }
};
