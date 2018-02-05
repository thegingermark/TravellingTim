var params = {};

const botConnection = new BotChat.DirectLine({
    secret: '** PUT SECRET HERE **'
  });

var bot = {
    id: 'Tim',
    name: 'Tim'
};

var user = {
    id: 'You',
    name: 'You'
}

BotChat.App({
    botConnection: botConnection,
    user: user,
    bot: bot,
}, document.getElementById("BotChatGoesHere"));

