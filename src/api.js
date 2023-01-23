const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();
// hosted URL  : http://localhost:9000/.netlify/functions/api
router.get("/", (req, res) => {
  res.json({
    hello: "hi!"
  });
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
