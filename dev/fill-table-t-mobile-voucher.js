const AWS = require("aws-sdk");
const config = require('./config.json');
const {NEW, RESERVED, APPLIED} = require('../src/lambda/enum/voucher-status');
const messageToString = require('../src/lambda/log/db-result-to-string');

const ITEMS_QTY = 100;
const BATCH_ID = 'T-Mobile_#1';
AWS.config.update(config);

const docClient = new AWS.DynamoDB.DocumentClient();

console.log("Importing movies into DynamoDB. Please wait.");

for (let i = 0; i < ITEMS_QTY; i++) {
    const code = `someCode${i}`;
    const params = {
        TableName: "sponsorship-vouchers",
        Item: {
            code,
            batchId: BATCH_ID,
            voucherStatus: NEW
        }
    };

    docClient.put(params, (err) => {
        if (err) {
            console.error(`Unable to add the ${code} code. Error JSON:`, messageToString(err));
        } else {
            console.log(`Code added: ${code}`);
        }
    });
}

for (let i = 0; i < ITEMS_QTY / 5; i++) {
    const code = `someCode${i}`;
    const params = {
        TableName: "sponsorship-vouchers",
        Item: {
            code,
            batchId: `another-BATCH_ID`,
            voucherStatus: [NEW, APPLIED, RESERVED][Math.floor(Math.random() * 3)]
        }
    };

    docClient.put(params, (err) => {
        if (err) {
            console.error(`Unable to add the ${code} code. Error JSON:`, messageToString(err));
        } else {
            console.log(`Code added: ${code}`);
        }
    });
}
