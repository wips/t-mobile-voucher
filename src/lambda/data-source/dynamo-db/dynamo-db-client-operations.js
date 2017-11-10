module.exports = {
    whenGet: (docClient, params) => {
        return new Promise((resolve, reject) => {
            docClient.get(params, (err, data) => onResult(err, data, reject, resolve));
        });
    },
    whenQuery: (docClient, params) => {
        return new Promise((resolve, reject) => {
            docClient.query(params, (err, data) => onResult(err, data, reject, resolve));
        });
    },
    whenUpdate: (docClient, params) => {
        return new Promise((resolve, reject) => {
            docClient.update(params, (err, data) => onResult(err, data, reject, resolve));
        });
    }
};

function onResult(err, data, reject, resolve) {
    "use strict";
    return err ? reject(err) : resolve(data);
}
