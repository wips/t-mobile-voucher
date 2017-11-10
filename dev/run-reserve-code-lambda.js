const AWS = require("aws-sdk");
const reserveCodeLambda = require('../src/lambda/reserve-code-lambda');
const config = require('./config.json');
AWS.config.update(config);

const campaignId = 'T-Mobile_#1';
reserveCodeLambda.handler({memberId: 1, campaignId}, {}, (err, data) => {
    if (err) {
        console.error(err);
    } else {
        console.log(data);
    }
});
