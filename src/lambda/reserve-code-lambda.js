const getSponsorshipVouchersService = require('./data-source/data-access-services/sponsorship-vouchers-service');

exports.handler = (event, context, callback) => {
    if (!event.memberId || !event.campaignId) {
        return callback('memberId or campaignId is not present');
    }
    const service = getSponsorshipVouchersService(event.campaignId);
    service.getCode()
        .then((code) => callback(null, `[OK] We've reserved for you a voucher which code is "${code}"`))
        .catch((err) => callback(`[ERR] Something bad has happened: "${err}"`));
};
