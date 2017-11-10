const AWS = require("aws-sdk");
const {UPDATED_NEW} = require('../../enum/db-update-result-values');
const log = require('../../log/db-result-log');
const {whenGet, whenQuery, whenUpdate} = require('./dynamo-db-client-operations');

module.exports = function getGenericDynamoDBDocClient(tableName) {
    "use strict";
    const docClient = new AWS.DynamoDB.DocumentClient();
    const NO_LIMIT = -1;

    return {
        read,
        update,
        query
    };

    function read(key, isConsistentRead = true) {
        const params = {
            TableName: tableName,
            Key: key,
            ConsistentRead: isConsistentRead
        };
        return whenGet(docClient, params)
            .then(log, log);
    }

    function query(keyConditionExpression, expressionAttrNames, expressionAttrValues, options) {
        const {limit = NO_LIMIT, indexName = '', isConsistentRead = true} = options;
        const params = {
            TableName: tableName,
            KeyConditionExpression: keyConditionExpression,
            ExpressionAttributeNames: expressionAttrNames,
            ExpressionAttributeValues: expressionAttrValues,
            ConsistentRead: isConsistentRead
        };

        // params.KeyConditionExpression = '#batchId = :batchId';
        // params.ExpressionAttributeNames = {'#batchId':  'batchId'};
        // params.ExpressionAttributeValues = {':batchId': 'T-Mobile_#1'};
        if (indexName !== '') {
            params.IndexName = indexName;
        }
        if (limit !== NO_LIMIT) {
            params.Limit = limit;
        }
        console.log(params)

        const queryPromise = whenQuery(docClient, params);
        log(queryPromise);
        return queryPromise;
    }

    function update(key, updateExpression, expressionAttrsValues, conditionalExpression = null) {
        const params = {
            TableName: tableName,
            Key: key,
            UpdateExpression: updateExpression,
            ExpressionAttributeValues: expressionAttrsValues,
            ReturnValues: UPDATED_NEW
        };
        if (conditionalExpression !== null) {
            params.ConditionalExpression = conditionalExpression;
        }
        return whenUpdate(docClient, params)
            .then(log, log);
    }
};
