'use strict';

const validateConfig = require('./validateConfig');
require('dotenv').config();

module.exports = () => {
    let config = {
        botName: 'Fab 5',
        templates: [],
        slackToken: process.env.TOKEN,
        debug: true,
    };
    validateConfig(config);

    return config;
}
