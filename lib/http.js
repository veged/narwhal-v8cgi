
exports.read = function (url) {
    try {
        return new HTTP.ClientRequest(url).send(true).data;
    } finally {
    }
};

exports.copy = function (source, target) {
    new require('os').command(['wget', source, '-O', target]);
};

