const messageToString = require('./db-result-to-string');

module.exports = function dbResultLog(whenResult) {
    whenResult
        .then((data) => console.log(messageToString(data)))
        .catch((err) => console.error(messageToString(err)));
    return whenResult;
};
