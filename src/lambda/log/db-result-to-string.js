module.exports = function dbMessageToString(message) {
    "use strict";
    return JSON.stringify(message, null, 2)
};
