'use strict';

const validateConfig = require('./validateConfig');
const {TOKEN} = require('../../tokens/token');

module.exports = () => {
    let config = {
        botName: 'Fab 5',
        templates: [],
        slackToken: TOKEN,
        debug: true,
    };
    validateConfig(config);

    return config;
}
