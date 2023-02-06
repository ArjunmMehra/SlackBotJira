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
// const axios = require("axios");
const request = require('request');

const { WebClient } = require("@slack/web-api");
const { channel } = require("slack-block-builder");


const JIRA_URL = process.env.JIRA_URL;
const JIRA_USERNAME = process.env.USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const createEndPoint = "rest/api/3/issue";

const axiosConfig = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization:
      "Basic " +
      Buffer.from(JIRA_USERNAME + ":" + JIRA_TOKEN).toString("base64"),
  },
};

const app = express();
const router = express.Router();

const createData = (payload) => {
  const { summary, description, issueType } = payload;
  return JSON.stringify({
    fields: {
      project: {
        id: "10000",
      },
      summary: `${summary}`,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `${description}`,
              },
            ],
          },
        ],
      },
      labels: [`${issueType}`],
      issuetype: {
        id: "10001",
      },
    },
  });
};
// hosted URL  : http://localhost:9000/.netlify/functions/api
router.post("/", async (req, res) => {
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
      // const result = await jiraService.createTicket(payload);
      // const response = await axios.post(
      //   JIRA_URL + createEndPoint,
      //   createData(payload),
      //   axiosConfig
      // );

      await createJIRA(payload);
     
      res.status(200).end();
      console.log("after end");
    }
  }
});

const createJIRA = async (payload) => {

const options = {
  method: 'POST',
  url: `${JIRA_URL}${createEndPoint}`,
  auth: {
    username: JIRA_USERNAME,
    password: JIRA_TOKEN
  },
  headers: {
    'Content-Type': 'application/json'
  },
  body: createData(payload)
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);
  bot.postMessage(channel, slackMessageBuilders.createdMessage(), body);
  console.log('body',body);
});

}

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
    console.log('result',result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const handleUserChoiceResponse = async (actions, res, trigger_id) => {
  const value = actions[0].value;
  if (value === "view") {
    await openViewTicketModal(trigger_id);
  } else if (value === "create") {
    const result = await openCreateTicketModal(trigger_id);
    console.log('result of create model', result)
    res.send('creating ticket')
  } else {
    bot.postMessage(channel.id, "not_a_valid_choice");
    res.send("not_a_valid_choice");
  }
};

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
