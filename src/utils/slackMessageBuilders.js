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
      text: `*Hey There What would you like me to do today? <@${user}>*`,
      attachments: [
        {
          text: {
            type: "mrkdwn",
            text: `*Hey There What would you like me to do today? <@${user}>*`,
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

  getCreateTicketModal() {
    return {
      "type": "modal",
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
          "type": "input",
          "label": {
            "type": "plain_text",
            "text": "Enter the summary of the issue",
            "emoji": true
          },
          "element": {
            "type": "plain_text_input"
          }
        },
        {
          "type": "input",
          "label": {
            "type": "plain_text",
            "text": "Enter a detailed description of the issue",
            "emoji": true
          },
          "element": {
            "type": "plain_text_input",
            "multiline": true
          }
        },
        {
          "type": "section",
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
                "value": "value-0"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": ":pencil:Task",
                  "emoji": true
                },
                "value": "value-1"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": ":scroll:Story",
                  "emoji": true
                },
                "value": "value-2"
              }
            ],
            "action_id": "radio_buttons-action"
          }
        }
      ]
    }
  },
  getViewTicketModal() {
    return {
      "type": "modal",
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
          "type": "input",
          "label": {
            "type": "plain_text",
            "text": ":wave: What is the ticket id?",
            "emoji": true
          },
          "element": {
            "type": "plain_text_input"
          }
        }
      ]
    }
  }
};
