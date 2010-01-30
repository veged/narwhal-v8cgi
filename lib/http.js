
exports.read = function (url) {
    try {
        return new HTTP.ClientRequest(url).send(true).data;
    } finally {
    }
};

exports.readTo = function (url, target) {
    new require('os').command(['wget', url, ' -O ', target]);
};

