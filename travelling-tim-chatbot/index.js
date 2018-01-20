var builder = require('botbuilder');
var express = require('express');
var bodyParser = require('body-parser');
var botMiddleware = require('./middleware');

const app = express();

//Create express app
app.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s started', app.name);
});

//express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Create chatconnector and add app id and password - found on botframework website
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

//Create a post uri for the chatconnect to listen to
app.post('/api/messages', connector.listen());

//Create new UniversalBot and add inMemoryStorage to keep track of the session
var inMemoryStorage = new builder.MemoryBotStorage();
var bot = new builder.UniversalBot(connector).set('storage', inMemoryStorage);

//Add Send Typing for each message sent
bot.use({
    botbuilder: function(session, next){
        botMiddleware.delayResponseTyping(session, 2);
        next();
    }
});

//Default dialog
bot.dialog('/', function (session) {
    session.send('I\'m not sure how to answer that.');
});

//Add dialogs
bot.dialog('Greeting', function (session) {
    sendMessageWithActions(session, 'Hi there :) I\'m Tim - ask me a question to get started.');
}).triggerAction({
    matches: /^hey*$|^hello*$|^sup*$|^hi*$/i,
});

bot.dialog('Onboarding', function (session) {
    session.send('Onboarding goes here.');
}).triggerAction({
    matches: /^onboard*$/i,
});

bot.dialog('Menu', function (session) {
    session.send('Menu goes here');
}).triggerAction({
    matches: /^onboard*$/i,
});

bot.dialog('Help', [
    function (session) {
        builder.Prompts.text(session, 'Leave a message for a human advisor and they\'ll get back to you as soon as possible.');
    },
    function (session, results) {
        if(results){
            session.send('Thanks, I\'ll make sure a human gets this message!');
        }
    }
]).triggerAction({
    matches: /^help*$/i,
})

//Useful functions for re-use
function sendMessageWithActions(session, msg) {
    session.send(new builder.Message(session)
        .text(msg)
        .suggestedActions(
        builder.SuggestedActions.create(
            session, [
                builder.CardAction.imBack(session, 'onboard', 'New User'),
                builder.CardAction.imBack(session, 'menu', 'Menu'),
                builder.CardAction.imBack(session, 'help', 'Help')
            ]
        )));
}