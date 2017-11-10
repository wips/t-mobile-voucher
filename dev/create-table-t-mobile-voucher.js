const AWS = require("aws-sdk");
const config = require('./config.json');
const messageToString = require('../src/lambda/log/dbResultToString');

AWS.config.update(config);

const dynamodb = new AWS.DynamoDB();

const params = {
    TableName : "sponsorship-vouchers",
    KeySchema: [
        { AttributeName: "code", KeyType: "HASH" },      // partition-key
        { AttributeName: "batchId", KeyType: "RANGE" }   // sort-key
    ],
    AttributeDefinitions: [
        { AttributeName: "code", AttributeType: "S" },
        { AttributeName: "batchId", AttributeType: "S" },
        { AttributeName: "voucherStatus", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [{
        IndexName: 'voucherStatus-index',
        KeySchema: [
            { AttributeName: "voucherStatus", KeyType: "HASH" },  //Partition key
            { AttributeName: "batchId", KeyType: "RANGE" }  //Sort key
        ],
        Projection: {
            ProjectionType: 'INCLUDE',
            NonKeyAttributes: ['code']
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
        }
    }]
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", messageToString(err));
    } else {
        console.log("Created table. Table description JSON:", messageToString(data));
    }
});
