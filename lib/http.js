
exports.read = function (url) {
    try {
        return new HTTP.ClientRequest(url).send(true).data;
    } finally {
    }
};

exports.readTo = function (url, target) {
    new (system.v8cgi.require('process').Process)().exec('wget ' + url + ' -O ' + target);
};

