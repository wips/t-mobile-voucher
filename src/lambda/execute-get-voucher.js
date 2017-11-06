const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  const input = {
    memberId: event.memberId,
    campaignId: event.campaignId,
  };
  const params = {
    stateMachineArn: event.stateMachineArn,
    input: JSON.stringify(input),
  };

  const stepFunctions = new AWS.StepFunctions();

  const checkResult = executionArn => setTimeout(() => {
    stepFunctions.describeExecution({ executionArn }, (error, data) => {
      if (error) {
        callback(error);
      }
      else {
        if (data.status === 'RUNNING') {
          checkResult(executionArn);
        }
        else {
          callback(null, data.output);
        }
      }
    });
  }, 10);

  stepFunctions.startExecution(params, (error, data) => {
    if (error) {
      callback(error);
    }
    else {
      checkResult(data.executionArn);
    }
  });
};
