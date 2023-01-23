const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();
// hosted URL  : http://localhost:9000/.netlify/functions/api
router.post("/", (req, res) => {
    const data = req;
    var callbackId = data.callback_id;
    var actionValue = data.actions[0].value;
    if (callbackId === `${constants.TICKET_LIST_SELECT}`) {
        if (actionValue === "option1") {
            bot.postMessage(data.channel, 'You selected option 1, this is what I will do...');
        } else if (actionValue === "option2") {
            bot.postMessage(data.channel, 'You selected option 2, this is what I will do...');
        } else if (actionValue === "option3") {
            bot.postMessage(data.channel, 'You selected option 3, this is what I will do...');
        }
    }
   return data;
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
