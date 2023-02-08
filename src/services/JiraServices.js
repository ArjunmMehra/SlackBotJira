var axios = require("axios");

const JIRA_URL = process.env.JIRA_URL;
const JIRA_USERNAME = process.env.USER;
const JIRA_TOKEN = process.env.JIRA_TOKEN;

const createEndPoint = "rest/api/3/issue";
const getTaskEndPoint = `rest/api/3/issue/${issueNo}`;

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

var config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization:
      "Basic " +
      Buffer.from(JIRA_USERNAME + ":" + JIRA_TOKEN).toString("base64"),
  },
};

module.exports = {
  async createTicket(payload) {
    const { description, issueType } = payload;
    const response = await axios.default.post(
      JIRA_URL + createEndPoint,
      createData(payload),
      config
    );
    console.log(response);
    return {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `New Ticket ${response.data.key}`,
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Type:*\n${issueType}`,
            },
            {
              type: "mrkdwn",
              text: "*Created by:*\nAdmin",
            },
          ],
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*When:*\n ${
                new Date(Date.now()).toLocaleString().split(",")[0]
              }`,
            },
            {
              type: "mrkdwn",
              text: `*Description:*\n${description}`,
            },
          ],
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: "*Assigned To:*\nArjun Singh",
            },
            {
              type: "mrkdwn",
              text: "*Estimated Completion:*\n32.0 hours (4 days)",
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<${JIRA_URL}browse/${response.data.key}|View ticket>`,
          },
        },
      ],
    };
  },

  async getTaskDetails() {
    const response = await axios.get(JIRA_URL + getTaskEndPoint, config);
    console.log(response);

    return {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `Details of Ticket ${response.data.key}`,
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Type:*\n${response.data.fields.labels[0]}`,
            },
            {
              type: "mrkdwn",
              text: `*Assigned To:*\n${response.data.fields.assignee.displayName}`,
            },
          ],
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Summary:*\n${response.data.fields.summary}`,
            },
            {
              type: "mrkdwn",
              text: `*Description:*\n${response.data.fields.description?.content[0].content[0].text}`,
            },
          ],
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Status:*\n${response.data.fields.status.name}`,
            },
          ],
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `<${JIRA_URL}browse/${response.data.key}|View ticket>`,
          },
        },
      ],
    };
  },
};
