const constants = require('./src/constants');
const slackMessageBuilders = require('./src/utils/slackMessageBuilders');
const setupConfig = require('./src/setup/setupConfig');
const setupSlackBot = require('./src/setup/setupSlackBot');
const jiraService = require('./src/services/JiraServices');
const config = setupConfig();
const bot = setupSlackBot(config);

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
    const param = {"attachments":[
        {
          "callback_id": "pick_channel_for_fun",
          "text": "Choose a channel",
          "id": 1,
          "color": "2b72cb",
          "actions": [
            {
              "name": "subject_list",
              "text": "Select one",
              "type": "select",
              "options": [
                {
                  "text": "Anti Racism",
                  "value": "anti_racism"
                },
                {
                  "text": "Anti Sexism",
                  "value": "anti_sexism"
                },
                {
                  "text": "LGBTQ+ Allyship",
                  "value": "lgbtq_allyship"
                },
                {
                  "text": "Autism allyship",
                  "value": "autism_allyship"
                }
              ]
            }
        ],
          "fallback":"Choose a channel"
        }
      ],
    }
    bot.postMessage(
        channel,
        'list',
        param,
        function(data){
            console.log(data);
        }
    );
}