(function (evalGlobal) {

    if(!File.prototype.flush) File.prototype.flush = function(){};

    var read = function(path) {
        var file = new File(path).open('r'),
            res = file.read();
        file.close();
        return res;
    }; // function(path:string):string


    var isFile = function(path){ return new File(path).isFile() }; // function(path:string):boolean

    var prefix = system.env.NARWHAL_HOME;
    var enginePrefix = system.env.NARWHAL_ENGINE_HOME;

    if (!Object.create) {
        Object.create = function(proto, props){
            var res, tmp = function(){};
            tmp.prototype = proto;
            Object.defineProperties((res = new tmp), props);
            return res;
        }
    }

    eval(read(prefix + "/narwhal.js"))({
        system: {
            global: this,
            evalGlobal: evalGlobal,
            engine: 'v8cgi', /*TODO*/
            engines: ['v8cgi', 'default'], /*TODO*/
            os: "", /* TODO /\bwindows\b/i for Windows FS support */
            // XXX engines may include any number of
            // prioritized generic engines like:
            // rhino, java, c, v8, default
            print: function(s){ system.stdout(s + '\n'); return s; },
            evaluate: function (text) {
                // TODO maybe something better here:
                return eval(
                    "(function(require,exports,module,system,print){" +
                    text +
                    "/**/\n})"
                );
            },
            prefix: prefix,
            prefixes: [enginePrefix, prefix],
            getcwd: system.getcwd,
            env: system.env,
            args: system.args.slice(2),
            stdin: {
                read: system.stdin,
                readLine: function() {
                    var res, char;
                    while ((char = system.stdin(1)) != '\n' || !char) res += char;
                    return res;
                }
            },
            stdout: {
                write: function(data) { system.stdout(data); return this; },
                flush: function() {}
            },
            stderr: {
                write: function(data) { system.stderr(data); return this; },
                print: function(data) { system.stderr(data); return this; },
                flush: function() {}
            },
            debug: false,
            verbose: false,
            supportsTusk: true,
            v8cgi: {
                require: require
            }
        },
        file: {
            read: read,
            isFile: isFile,
            open: function(path, mode) { return new File(path).open(mode) }
        }
    });

}).call(this, function () {
    return eval(arguments[0]);
});
