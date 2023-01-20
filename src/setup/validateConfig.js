const constants = require('../constants');
module.exports = (config) => {
    if (!config.slackToken) {
        throw new Error(constants.ERROR_SLACK_TOKEN);
    }
}