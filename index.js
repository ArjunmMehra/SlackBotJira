const SlackBot = require('slackbots');

const bot = new SlackBot({
  token: 'xoxb-4652388056438-4689895792400-CDNTdQ8B06vuA4TC52u6b4t2',
  name: 'Hello Bot'
});

bot.on('start', () => {
  // Do something when the bot starts
  var params = {
    icon_emoji: ':cat:'
};
  bot.postMessageToChannel('gl-ideathon', 'Hello this is test bot', params);
});

bot.on('message', (data) => {
  // Handle incoming messages
  console.log('data', data)
  const { text } = data;

  if (text.includes('hello')) {
    bot.postMessageToChannel('gl-ideathon', 'Hello, I received your message');
  }
});
