exports.handler = (event, context, callback) => {
  if (!event.memberId || !event.campaignId) {
    return callback('memberId or campaignId is not present');
  }
  callback(null, `memberId is ${event.memberId}, campaignId is ${event.campaignId}`);
};
