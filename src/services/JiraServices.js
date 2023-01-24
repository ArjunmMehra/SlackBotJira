var axios = require('axios');

const JIRA_URL = 'https://arjunmehra2921.atlassian.net/';
const JIRA_USERNAME = 'm.ahuja2611@gmail.com';
const JIRA_API_TOKEN = 'ii88ouc9OgyNdgt8yD8l7146';

const summary = "Summary of JIRA";
const description = "Description of JIRA";

const createEndPoint = "rest/api/3/issue";
const getEndPoint = "rest/api/3/issue/FI-2";

var createData = JSON.stringify({
  "fields": {
    "project": {
      "id": "10000"
    },
    "summary": `${summary}`,
    "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "type": "text",
              "text": `${description}`
            }
          ]
        }
      ]
    },
    "issuetype": {
      "id": "10001"
    }
  }
});

var config = {
  headers: { 
    'Accept': 'application/json', 
    'Content-Type': 'application/json', 
    'Authorization': 'Basic ' + Buffer.from(JIRA_USERNAME + ':' + JIRA_API_TOKEN).toString('base64')
  }
};


module.exports = {
    async createTicket() {
        const response = await axios.post(JIRA_URL + createEndPoint, createData, config);
        console.log(response);

       return  {
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "New Ticket",
                        "emoji": true
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Type:*\nIT"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Created by:*\nGaurav Sharma"
                        }
                    ]
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": `*When:*\n ${new Date(Date.now()).toLocaleString().split(',')[0]}`
                        },
                        {
                            "type": "mrkdwn",
                            "text": `*Description:*\n${description}`
                        }
                    ]
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": "*Assigned To:*\nArjun Singh"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Estimated Completion:*\n32.0 hours (4 days)"
                        }
                    ]
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `<${response.data.self}|View ticket>`
                    }
                }
            ]
        };
    },

    async getTaskDetails() {
        const response = await axios.get(JIRA_URL + getEndPoint);
        console.log(response);

    }
}