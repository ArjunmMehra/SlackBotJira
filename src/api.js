const express = require("express");
const serverless = require("serverless-http");

const app = express();
const router = express.Router();
// hosted URL  : http://localhost:9000/.netlify/functions/api
router.post("/", (req, res) => {
  console.log(req);
  console.log(req.apiGateway.event.body);
  res.send(req.apiGateway.event.body);
});

app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
