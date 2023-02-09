const express = require("express");
const serverless = require("serverless-http");
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

// Initialize the Slack API client
const client = new WebClient(process.env.TOKEN);

router.post("/", async (req, res) => {
  if (req.apiGateway.event.body) {
    let botMessageBody = decodeURIComponent(
      req.apiGateway.event.body.replace("payload=", "")
    );
    console.log(botMessageBody);
    botMessageBody = JSON.parse(botMessageBody);

    if (botMessageBody.type === "interactive_message") {
      const { channel } = botMessageBody;
      console.log(botMessageBody.callback_id);
      const actions = botMessageBody.actions;
      if (botMessageBody.callback_id === "user_choice") {
        handleUserChoiceResponse(
          actions,
          res,
          botMessageBody.trigger_id,
          channel
        );
      } else {
        res.send("No choice selected");
      }
    } else if (botMessageBody.type === "view_submission") {
      const { callback_id, state } = botMessageBody.view;

      console.log("callback id", callback_id);

      if (callback_id === "create") {
        
        const { channel, summary, desc, issue_type } = state.values;
        const channelId = channel.channel_action.selected_channel;
        const sum = summary.sum_input.value;
        const description = desc.desc_input.value;
        const issueType = issue_type.issue_type_action.selected_option.value;

        const payload = {
          summary: sum,
          description,
          issueType,
        };
        console.log("payload create", payload);

        try {
          const result = await jiraService.createTicket(payload);
          await bot.postMessage(
            channelId,
            slackMessageBuilders.createdMessage(),
            result
          );
          res.status(200).end();
          console.log("after end create");
        } catch (error) {
          console.log("create error", error);
        }
      } else if (callback_id === "view") {

        const { channel, ticket_id } = state.values;
        const ticketId = ticket_id.ticket_id_input.value;
        const channelId = channel.channel_action.selected_channel;

        const payload = {
          issueNo: ticketId,
        };
        console.log("payload view", payload);

        try {
          const result = await jiraService.getTaskDetails(payload);
          await bot.postMessage(
            channelId,
            slackMessageBuilders.createdMessage(),
            result
          );
          res.status(200).end();
          console.log("after end view");
        } catch (error) {
          console.log("view error", error);
        }
      }
    }
  }
});

// Open the modal using the trigger_id
const openCreateTicketModal = async (trigger_id, channel) => {
  try {
    const result = await client.views.open({
      trigger_id: trigger_id,
      view: slackMessageBuilders.getCreateTicketModal(channel),
    });

    console.log(result);
  } catch (error) {
    console.error(error);
  }
};

const openViewTicketModal = async (trigger_id, channel) => {
  try {
    const result = await client.views.open({
      trigger_id: trigger_id,
      view: slackMessageBuilders.getViewTicketModal(channel),
    });
    console.log("result", result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const handleUserChoiceResponse = async (actions, res, trigger_id, channel) => {
  const value = actions[0].value;
  if (value === "view") {
    await openViewTicketModal(trigger_id, channel);
  } else if (value === "create") {
    const result = await openCreateTicketModal(trigger_id, channel);
    console.log("result of create model", result);
    res.send("creating ticket");
  } else {
    bot.postMessage("C04KA1GD8SH", "not_a_valid_choice");
    res.send("not_a_valid_choice");
  }
};

app.use(`/.netlify/functions/api`, router);

module.exports = app;

module.exports.handler = serverless(app);
