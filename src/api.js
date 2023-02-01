const express = require("express");
const serverless = require("serverless-http");
const constants = require("./constants");
const slackMessageBuilders = require("/utils/slackMessageBuilders");
const setupConfig = require("/setup/setupConfig");
const setupSlackBot = require("/setup/setupSlackBot");
const jiraService = require("/services/JiraServices");
const config = setupConfig();
const bot = setupSlackBot(config);
require("dotenv").config();

const { WebClient } = require("@slack/web-api");

const app = express();
const router = express.Router();
// hosted URL  : http://localhost:9000/.netlify/functions/api
router.post("/", (req, res) => {
  if (req.apiGateway.event.body) {
    //sample data
    // const encoded = "payload=%7B%22type%22%3A%22interactive_message%22%2C%22actions%22%3A%5B%7B%22name%22%3A%22subject_list%22%2C%22type%22%3A%22select%22%2C%22selected_options%22%3A%5B%7B%22value%22%3A%22anti_sexism%22%7D%5D%7D%5D%2C%22callback_id%22%3A%22pick_channel_for_fun%22%2C%22team%22%3A%7B%22id%22%3A%22T04K6BE1NCW%22%2C%22domain%22%3A%22fab5-headquarters%22%7D%2C%22channel%22%3A%7B%22id%22%3A%22C04KA1GD8SH%22%2C%22name%22%3A%22gl-ideathon%22%7D%2C%22user%22%3A%7B%22id%22%3A%22U04KFDB7AG4%22%2C%22name%22%3A%22arjunmehra20%22%7D%2C%22action_ts%22%3A%221674544693.409740%22%2C%22message_ts%22%3A%221674467998.149729%22%2C%22attachment_id%22%3A%221%22%2C%22token%22%3A%225QLhF55B3HgnCjsqbsd508le%22%2C%22is_app_unfurl%22%3Afalse%2C%22enterprise%22%3Anull%2C%22is_enterprise_install%22%3Afalse%2C%22original_message%22%3A%7B%22type%22%3A%22message%22%2C%22subtype%22%3A%22bot_message%22%2C%22text%22%3A%22list%22%2C%22ts%22%3A%221674467998.149729%22%2C%22username%22%3A%22Fab+5%22%2C%22bot_id%22%3A%22B04KSM0CB7V%22%2C%22app_id%22%3A%22A04KSLE9C59%22%2C%22blocks%22%3A%5B%7B%22type%22%3A%22rich_text%22%2C%22block_id%22%3A%22t58%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22rich_text_section%22%2C%22elements%22%3A%5B%7B%22type%22%3A%22text%22%2C%22text%22%3A%22list%22%7D%5D%7D%5D%7D%5D%2C%22attachments%22%3A%5B%7B%22id%22%3A1%2C%22color%22%3A%222b72cb%22%2C%22fallback%22%3A%22Choose+a+channel%22%2C%22text%22%3A%22Choose+a+channel%22%2C%22callback_id%22%3A%22pick_channel_for_fun%22%2C%22actions%22%3A%5B%7B%22id%22%3A%221%22%2C%22name%22%3A%22subject_list%22%2C%22text%22%3A%22Select+one%22%2C%22type%22%3A%22select%22%2C%22data_source%22%3A%22static%22%2C%22options%22%3A%5B%7B%22text%22%3A%22Anti+Racism%22%2C%22value%22%3A%22anti_racism%22%7D%2C%7B%22text%22%3A%22Anti+Sexism%22%2C%22value%22%3A%22anti_sexism%22%7D%2C%7B%22text%22%3A%22LGBTQ%2B+Allyship%22%2C%22value%22%3A%22lgbtq_allyship%22%7D%2C%7B%22text%22%3A%22Autism+allyship%22%2C%22value%22%3A%22autism_allyship%22%7D%5D%7D%5D%7D%5D%7D%2C%22response_url%22%3A%22https%3A%5C%2F%5C%2Fhooks.slack.com%5C%2Factions%5C%2FT04K6BE1NCW%5C%2F4687914064387%5C%2FjGijthltezLN7J34rv03YeAO%22%2C%22trigger_id%22%3A%224700662858513.4652388056438.225c6b205371d561e9d3af4b1c561678%22%7D";
    let botMessageBody = decodeURIComponent(
      req.apiGateway.event.body.replace("payload=", "")
    );
    console.log(botMessageBody);
    botMessageBody = JSON.parse(botMessageBody);
    if (botMessageBody.type === "interactive_message") {
      console.log(botMessageBody.callback_id);
      console.log('triggerid', botMessageBody.trigger_id);
      const actions = botMessageBody.actions;
      switch (botMessageBody.callback_id) {
        case "flow_choice":
          openModal(botMessageBody.trigger_id)
          break;
        case "create_ticket":
          res.send("view_ticket");
          break;
        default:
          openModal(botMessageBody.trigger_id)
          res.send("No callback configured");
      }
    }
  }
});

// Initialize the Slack API client
const client = new WebClient(process.env.TOKEN);

// Define the modal payload
const modalPayload = {
  type: "modal",
  callback_id: "modal-example",
  title: {
    type: "plain_text",
    text: "Example Modal",
  },
  blocks: [
    {
      type: "section",
      text: {
        type: "plain_text",
        text: "This is a section block inside the modal.",
      },
    },
  ],
  submit: {
    type: "plain_text",
    text: "Submit",
  },
};

// Open the modal using the trigger_id
const openModal = (trigger_id) => {
  client.conversations
    .open({
      trigger_id,
      view: modalPayload,
    })
    .then(console.log)
    .catch(console.error);
};

const handleFlowChoiceResponse = (actions, res, channel) => {
  const value = actions[0].value;
  if (value == "view") {
    bot.postMessage(channel.id, "view_ticket_selected from API");
    res.send("view_ticket_selected");
  } else if (value == "create") {
    bot.postMessage(channel.id, "view_ticket_selected");
    res.send("view_ticket_selected");
  } else {
    bot.postMessage(channel.id, "not_a_valid_choice");
    res.send("not_a_valid_choice");
  }
};

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
