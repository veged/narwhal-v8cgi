var io = require('io'),
    process = new (system.v8cgi.require('process').Process)();

//var javaZip = Packages.java.util.zip;
//var JavaZipFile = javaZip.ZipFile;
//var JavaZipEntry = javaZip.ZipEntry;

// unzip
//new zip.Unzip(zipFile).forEach(function (entry) {
//    if (entry.isDirectory())
//        return;
//    var parts = fs.split(entry.getName());
//    parts.shift(); // name-project-comment ref dirname
//    var path = targetPath.join(fs.join.apply(null, parts));
//    path.dirname().mkdirs();
//    notes[name].files.push(path);
//    print(" + " + path);
//    path.write(entry.read('b'), 'b');
//});

exports.unzip = function (source, target) {
    if (!target)
        target = system.fs.path(source).absolute().dirname();
    target = system.fs.path(target);
    return process.exec('unzip ' + source + ' -d ' + target);
};

exports.Unzip = function (path) {
    this.path = path;
    var _this = this,
        entries = this.entries = {},
        full = process.exec('zipinfo -s ' + path).split('\n');
    full.shift();
    process.exec('zipinfo -1 ' + path).split('\n').forEach(function(v, i){
        v && (entries[v] = new exports.Entry(_this, v, full[i][0] == 'd'));
    });
};

exports.Unzip.prototype.forEach = function (fn, context) {
    for (var i in this.entries) {
        this.entries.hasOwnProperty(i) && fn.call(context, this.entries[i]);
    }
};

exports.Unzip.prototype.close = function () { };

exports.Entry = function (archive, name, isDirectory) {
    this._archive = archive;
    this._name = name;
    this._isDirectory = isDirectory;
};

exports.Entry.prototype.getName = function () {
    return this._name;
};

exports.Entry.prototype.isDirectory = function () {
    return this._isDirectory;
};

exports.Entry.prototype.open = function (mode, options) {
    throw Error("zip.Entry.open not yet implemented. Try use zip.Entry.read.");
};

exports.Entry.prototype.read = function () {
    return process.exec('unzip -p ' + this._archive.path + ' ' + this._name);
};

exports.Entry.prototype.copy = function (output, mode, options) {
    throw Error("zip.Entry.copy not yet implemented. Try use zip.Entry.read.");
};


