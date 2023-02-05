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
const { channel } = require("slack-block-builder");

const app = express();
const router = express.Router();
// hosted URL  : http://localhost:9000/.netlify/functions/api
router.post("/", (req, res) => {
  if (req.apiGateway.event.body) {
    let botMessageBody = decodeURIComponent(
      req.apiGateway.event.body.replace("payload=", "")
    );
    console.log(botMessageBody);
    botMessageBody = JSON.parse(botMessageBody);
    if (botMessageBody.type === "interactive_message") {
      console.log(botMessageBody.callback_id);
      const actions = botMessageBody.actions;
      if (botMessageBody.callback_id === "user_choice") {
        handleUserChoiceResponse(actions, res, botMessageBody.trigger_id);
      } else {
        res.send("No choice selected");
      }
    } else if (botMessageBody.type === "view_submission") {
      const values = botMessageBody.view.state.values;

      const summary = values.summary.sum_input.value;
      const description = values.desc.desc_input.value;
      const issueType =  values.issue_type.issue_type_action.selected_option.value;

      const payload = {
        summary,
        description,
        issueType,
      };
      console.log("payload", payload);
     client.view(botMessageBody.view.id).ack({
      response_action: 'update',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'View submission acknowledged!'
          }
        }
      ]
    });

      // jiraService.createTicket(payload);

      // Acknowledge the modal submission
      // res.send({
      //   status: 200,
      //   response_action: "clear",
      // });
      res.send("view submission");
      // res.sendStatus(200).end();
    }
  }
});

// Initialize the Slack API client
const client = new WebClient(process.env.TOKEN);

// Open the modal using the trigger_id
const openCreateTicketModal = async (trigger_id) => {
  try {
    const result = await client.views.open({
      trigger_id: trigger_id,
      view: slackMessageBuilders.getCreateTicketModal(),
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const openViewTicketModal = async (trigger_id) => {
  try {
    const result = await client.views.open({
      trigger_id: trigger_id,
      view: slackMessageBuilders.getViewTicketModal(),
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const handleUserChoiceResponse = async (actions, res, trigger_id) => {
  const value = actions[0].value;
  if (value === "view") {
    await openViewTicketModal(trigger_id);
  } else if (value === "create") {
    await openCreateTicketModal(trigger_id);
  } else {
    bot.postMessage(channel.id, "not_a_valid_choice");
    res.send("not_a_valid_choice");
  }
};

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
