const getGenericClient = require('../dynamo-db/generic-dynamo-db-doc-client');
const {NEW} = require('../../enum/voucher-status');

module.exports = function getSponsorshipVouchersService(batchId) {
    "use strict";
    const TABLE_NAME = 'sponsorship-vouchers';
    const client = getGenericClient(TABLE_NAME);

    return {
        getCode,
        applyCode
    };

    function getCode() {
        const keyConditionExpression = '#batchId = :batchId and #voucherStatus = :voucherStatus';
        const expressionAttrNames = {
            '#batchId': 'batchId',
            '#voucherStatus': 'voucherStatus'
        };
        const expressionAttrValues = {
            ':batchId': {S: batchId},
            ':voucherStatus': {S: NEW}
        };
        const options = {
            isConsistentRead: false,
            indexName: 'voucherStatus-index',
            limit: 1
        };

        const code = client.query(
            keyConditionExpression,
            expressionAttrNames,
            expressionAttrValues,
            options
        );

        const whenReserved = code
            .then((dbResult) => reserveCode(dbResult));

        return whenReserved;
    }

    function reserveCode({Items}) {
        if (!Items.length) {
            return Promise.reject(`There're no codes with status ${NEW} available`);
        }
        return Items[0].code;
    }

    function applyCode() {

    }
};
