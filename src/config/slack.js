const { WebClient, LogLevel } = require("@slack/web-api");
require("dotenv/config");

const client = new WebClient(process.env.SLACK_TOKEN, {
  logLevel: LogLevel.DEBUG,
});

module.exports = client
