const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
  const input = {
    memberId: event.memberId,
    campaignId: event.campaignId,
  };
  const name = createTimestamp().toString();
  const params = {
    stateMachineArn: event.stateMachineArn,
    input: JSON.stringify(input),
    name,
  };

  const stepFunctions = new AWS.StepFunctions();

  const checkResult = executionArn => setTimeout(() => {
    stepFunctions.getExecutionHistory({ executionArn }, (error, data) => {
      if (error) {
        callback(error);
      }
      else {
        const event = data.events.find(event => event.type === 'ExecutionSucceeded');
        if (event) {
          callback(null, event.executionSucceededEventDetails.output);
        }
        else {
          checkResult(executionArn);
        }
      }
    })
  }, 50);

  stepFunctions.startExecution(params, (error, data) => {
    if (error) {
      callback(error);
    }
    else {
      checkResult(data.executionArn);
    }
  });
};

const createTimestamp = () => new Date().valueOf();
