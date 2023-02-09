"use strict";

module.exports = {
  welcomeMessage() {
    return "Hello, How can I help? ";
  },
  defaultMessage() {
    return "Sorry, Cant help at the moment";
  },
  summery() {
    return "What is the summary of the issue?"
  },
  createdMessage() {
    return "Ticket Created Successfully";
  },
  getTaskMessage() {
    return "Task Details fetched Successfully";
  },
  description() {
    return "What is the description of the issue?";
  },
  issueType() {
    return 'What is the issue type?';
  },
  priority() {
    return "What is the priority?"
  },
  listBotMessage(user) {
    return {
      text: `*Hey What would you like me to do today? <@${user}>*`,
      attachments: [
        {
          text: {
            type: "mrkdwn",
            text: `*Hey What would you like me to do today? <@${user}>*`,
          },
          fallback: "You are unable to choose an option",
          callback_id: "user_choice",
          color: "#3AA3E3",
          attachment_type: "default",
          actions: [
            {
              name: "user_choice",
              text: "View Ticket status",
              type: "button",
              value: "view",
            },
            {
              name: "user_choice",
              text: "Create new Ticket",
              type: "button",
              value: "create",
            },
          ],
        },
      ],
    };
  },
  ticketFormMessage() {
    return {
      blocks: [
        {
          type: "section",
          text: {
            type: "plain_text",
            text: ":wave: Hey There!\n\nWe'd love to hear from you how we can make your work easier provide our support.",
            emoji: true,
          },
        },
        {
          type: "divider",
        },
        {
          type: "input",
          label: {
            type: "plain_text",
            text: "Issue Type",
            emoji: true,
          },
          element: {
            type: "multi_static_select",
            placeholder: {
              type: "plain_text",
              text: "Select your Issue Type",
              emoji: true,
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "Hardware",
                  emoji: true,
                },
                value: "value-0",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Software",
                  emoji: true,
                },
                value: "value-0",
              },
              {
                text: {
                  type: "plain_text",
                  text: "Requirement",
                  emoji: true,
                },
                value: "value-0",
              },
            ],
          },
        },
        {
          type: "input",
          label: {
            type: "plain_text",
            text: "Issue Title",
            emoji: true,
          },
          element: {
            type: "plain_text_input",
          },
        },
        {
          type: "input",
          label: {
            type: "plain_text",
            text: "Please describe your issue in detail here",
            emoji: true,
          },
          element: {
            type: "plain_text_input",
            multiline: true,
          },
        },
      ],
    };
  },

  getCreateTicketModal(channel) {
    return {
      "type": "modal",
      "callback_id": "create",
      "submit": {
        "type": "plain_text",
        "text": "Submit",
        "emoji": true
      },
      "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
      },
      "title": {
        "type": "plain_text",
        "text": "Create Ticket",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "block_id": "form",
          "text": {
            "type": "plain_text",
            "text": ":pencil2: Please provide the details for ticket creation",
            "emoji": true
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "block_id": "channel",
          "text": {
            "type": "mrkdwn",
            "text": "Pick a channel from the dropdown list"
          },
          "accessory": {
            "action_id": "channel_action",
            "type": "channels_select",
            "initial_channel": `${channel.id}`,
            "placeholder": {
              "type": "plain_text",
              "text": "Select a channel"
            }
          }
        },
        {
          "type": "input",
          "block_id": "summary",
          "label": {
            "type": "plain_text",
            "text": "Enter the summary of the issue",
            "emoji": true
          },
          "element": {
            "type": "plain_text_input",
            "action_id": "sum_input"
          }
        },
        {
          "type": "input",
          "block_id": "desc",
          "label": {
            "type": "plain_text",
            "text": "Enter a detailed description of the issue",
            "emoji": true
          },
          "element": {
            "type": "plain_text_input",
            "multiline": true,
            "action_id": "desc_input"
          }
        },
        {
          "type": "section",
          "block_id": "issue_type",
          "text": {
            "type": "mrkdwn",
            "text": "*Select the issue type*"
          },
          "accessory": {
            "type": "radio_buttons",
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": ":bug:Bug",
                  "emoji": true
                },
                "value": "bug"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": ":pencil:Task",
                  "emoji": true
                },
                "value": "task"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": ":scroll:Story",
                  "emoji": true
                },
                "value": "story"
              }
            ],
            "action_id": "issue_type_action"
          }
        }
      ]
    }
  },
  getViewTicketModal(channel) {
    return {
      "type": "modal",
      "callback_id": "view",
      "submit": {
        "type": "plain_text",
        "text": "Submit",
        "emoji": true
      },
      "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
      },
      "title": {
        "type": "plain_text",
        "text": "View Ticket Status",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "block_id": "channel",
          "text": {
            "type": "mrkdwn",
            "text": "Pick a channel from the dropdown list"
          },
          "accessory": {
            "action_id": "channel_action",
            "type": "channels_select",
            "initial_channel": `${channel.id}`,
            "placeholder": {
              "type": "plain_text",
              "text": "Select a channel"
            }
          }
        },
        {
          "type": "input",
          "block_id": "ticket_id",
          "label": {
            "type": "plain_text",
            "text": ":wave: What is the ticket id?",
            "emoji": true
          },
          "element": {
            "type": "plain_text_input",
            "action_id": "ticket_id_input"
          }
        }
      ]
    }
  }
};
