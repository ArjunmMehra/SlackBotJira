const constants = require("./src/constants");
const slackMessageBuilders = require("./src/utils/slackMessageBuilders");
const setupConfig = require("./src/setup/setupConfig");
const setupSlackBot = require("./src/setup/setupSlackBot");
const jiraService = require("./src/services/JiraServices");
const { listBotMessage } = require("./src/utils/slackMessageBuilders");
const config = setupConfig();
const bot = setupSlackBot(config);
require("dotenv").config();

bot.on("start", () => {
  console.log("Bot started!");
});

bot.on("message", (data) => {
  if (config.debug) {
    console.log("incoming", data);
  }

  try {
    if (
      data.type === constants.MESSAGE_TYPE &&
      data.text &&
      data.channel.startsWith("D") &&
      data.subtype !== constants.BOT_MESSAGE_TYPE
    ) {
      console.log("not valid user");
    } else if (
      data.type === constants.MESSAGE_TYPE &&
      data.text &&
      data.text.startsWith("<@" + bot.self.id + ">")
    ) {
      let args = data.text.split(" ");
      console.log(data);
      switch (args[1].toLowerCase()) {
        case constants.WELCOME_COMMAND:
          listBotOptions(data.channel, data.user);
          break;
        case constants.CREATE_TICKET:
          createTicket(data.channel);
          break;
        case constants.GET_TICKET:
          listBotOptions(data.channel, data.user);
         // getTaskDetails(data.channel);
          break;
        case constants.DESCRIPTION:
          description(data.channel);
          break;
        case constants.GET_DATA:
          getTicketData(data.channel);
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
async function createTicket(channel) {
  const payload = {
    summary : 'test summary',
    description: 'test des',
    issueType: 'Bug'
  }
  const result = await jiraService.createTicket(payload);
  bot.postMessage(channel, slackMessageBuilders.createdMessage(), result);
}
async function getTaskDetails(channel) {
  const result = await jiraService.getTaskDetails();
  bot.postMessage(channel, slackMessageBuilders.getTaskMessage(), result);
}
function listOptions(channel) {
  const param = {
    attachments: [
      {
        callback_id: "pick_channel_for_fun",
        text: "Choose a channel",
        id: 1,
        color: "2b72cb",
        actions: [
          {
            name: "subject_list",
            text: "Select one",
            type: "select",
            options: [
              {
                text: "Anti Racism",
                value: "anti_racism",
              },
              {
                text: "Anti Sexism",
                value: "anti_sexism",
              },
              {
                text: "LGBTQ+ Allyship",
                value: "lgbtq_allyship",
              },
              {
                text: "Autism allyship",
                value: "autism_allyship",
              },
            ],
          },
        ],
        fallback: "Choose a channel",
      },
    ],
  };
  bot.postMessage(channel, "Hello! How can I help you?", param);
}
function listBotOptions(channel, user) {
  bot.postMessage(
    channel,
    "Hello! How can I help you?",
    slackMessageBuilders.listBotMessage(user)
  );
}
function getTicketData(channel) {
  bot.postMessage(
    channel,
    "Hello! How can I help you?",
    slackMessageBuilders.ticketFormMessage()
  );
}
