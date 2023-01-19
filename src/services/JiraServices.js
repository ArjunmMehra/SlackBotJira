module.exports = {
    createTicket() {
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
                            "text": "*When:*\n20th Jan 2023"
                        },
                        {
                            "type": "mrkdwn",
                            "text": "*Description:*\nMouse not working"
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
                        "text": "<https://google.com|View ticket>"
                    }
                }
            ]
        };
    }
}