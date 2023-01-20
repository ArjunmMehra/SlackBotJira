const constants = require('./src/constants');
const slackMessageBuilders = require('./src/utils/slackMessageBuilders');
const setupConfig = require('./src/setup/setupConfig');
const setupSlackBot = require('./src/setup/setupSlackBot');
const jiraService = require('./src/services/JiraServices');
const config = setupConfig();
const bot = setupSlackBot(config);
const express = require('express');
const app = express();
require('dotenv').config();

//api to handle interactive response
app.get('/bot', (req, res) => {
console.log(req)
res.send([{ name: 'Item 1' }, { name: 'Item 2' }]);
});

app.listen(process.env.SERVICE_PORT, () => console.log(`Server started on port ${process.env.SERVICE_PORT}`));

bot.on('start', () => {
    console.log('Bot started!');
});

bot.on('message', (data) => {
    if (config.debug) {
        console.log(data);
    }

    try {
        if (data.type === constants.MESSAGE_TYPE && data.text &&
            data.channel.startsWith('D') &&
            data.subtype !== constants.BOT_MESSAGE_TYPE) {
        }
        
        else if (data.type === constants.MESSAGE_TYPE && data.text &&
            data.text.startsWith('<@' + bot.self.id + '>')) {

            let args = data.text.split(' ');
            switch (args[1].toLowerCase()) {
                case constants.WELCOME_COMMAND:
                    welcomeMessage(data.channel);
                    break;
                    case constants.CREATE_TICKET:
                    createTicket(data.channel);
                    break;
                    case constants.LIST_ISSUE_TYPE:
                    listOptions(data.channel);
                    break;
                    default:
                    defaultMessage();
            }
        }

    } catch (e) {
        bot.postMessage(data.channel, e.message);
    }

});

bot.on("interactive_message_callback", function(data) {
    var callbackId = data.callback_id;
    var actionValue = data.actions[0].value;
    if (callbackId === "wopr_game") {
        if (actionValue === "option1") {
            bot.postMessage(data.channel, 'You selected option 1, this is what I will do...');
        } else if (actionValue === "option2") {
            bot.postMessageToUser(data.channel, 'You selected option 2, this is what I will do...');
        } else if (actionValue === "option3") {
            bot.postMessageToUser(data.channel, 'You selected option 3, this is what I will do...');
        }
    }
});

function welcomeMessage(channel) {
    bot.postMessage(
        channel,
        slackMessageBuilders.welcomeMessage(config.templates)
    );
}

function defaultMessage(channel) {
    bot.postMessage(
        channel,
        slackMessageBuilders.defaultMessage(config.templates)
    );
}
function createTicket(channel) {
const result  = jiraService.createTicket();
    bot.postMessage(
        channel,
        slackMessageBuilders.createdMessage(),
        result
    );
}
function listOptions(channel){
    bot.postMessageToChannel(
        'gl-ideathon',
        'Hello! How can I help you?', {
            "attachments": [
                {
                    "text": "Please select an option:",
                    "fallback": "You are unable to choose a game",
                    "callback_id": "wopr_game",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "game",
                            "text": "Select...",
                            "type": "select",
                            "options": [
                                {
                                    "text": "Option 1",
                                    "value": "option1"
                                },
                                {
                                    "text": "Option 2",
                                    "value": "option2"
                                },
                                {
                                    "text": "Option 3",
                                    "value": "option3"
                                }
                            ]
                        }
                    ]
                }
            ]
        }, function(data){
            console.log(data);
        });
}