'use strict';

module.exports = {
    welcomeMessage() {
        return 'Hello There! ';
    },
    defaultMessage() {
        return 'Sorry, Cant help at the moment';
    },
    createdMessage() {
        return 'Ticket Created Successfully';
    },
    getTaskMessage() {
        return 'Task Details fetched Successfully';
    },
    listBotMessage(user) {
        return {
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": `*Hey There What would you like me to do today? <@${user}>*`
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "callback_id": "view_ticket",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "View Ticket Status"
                            },
                            "action_id": "view_ticket"
                        },
                        {
                            "type": "button",
                            "callback_id": "create_ticket",
                            "text": {
                                "type": "plain_text",
                                "emoji": true,
                                "text": "Create New Ticket"
                            },
                            "action_id": "create_ticket"
                        }
                    ]
                }
            ]
        };
    },
    ticketFormMessage(){
       return  {
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "plain_text",
                        "text": ":wave: Hey There!\n\nWe'd love to hear from you how we can make your work easier provide our support.",
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
                        "text": "Issue Type",
                        "emoji": true
                    },
                    "element": {
                        "type": "multi_static_select",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select your Issue Type",
                            "emoji": true
                        },
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Hardware",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Software",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Requirement",
                                    "emoji": true
                                },
                                "value": "value-0"
                            }
                        ]
                    }
                },
                {
                    "type": "input",
                    "label": {
                        "type": "plain_text",
                        "text": "Issue Title",
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
                        "text": "Please describe your issue in detail here",
                        "emoji": true
                    },
                    "element": {
                        "type": "plain_text_input",
                        "multiline": true
                    }
                }
            ]
        }
    }
}