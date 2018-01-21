require('dotenv').load();
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

//Add LUIS recogniser with link to LUIS model and set it to only enable when no other conversation is happening
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL).onEnabled(function (context, callback) {
    var enabled = context.dialogStack().length == 0;
    callback(null, enabled);
});
bot.recognizer(recognizer);

//Add Send Typing for each message sent
bot.use({
    botbuilder: function (session, next) {
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
    sendMessageWithActions(session, 'Hi there! Ask me a question to get started.');
    session.endDialog();
}).triggerAction({
    matches: 'Greeting',
});

bot.dialog('Onboarding', function (session) {
    session.send('Onboarding goes here.');
}).triggerAction({
    matches: /^onboard*$/i,
});

bot.dialog('Menu', function (session) {
    sendMenu(session);
}).triggerAction({
    matches: /^menu*$/i,
});

bot.dialog('Help', [
    function (session) {
        builder.Prompts.text(session, 'Leave a message for a human advisor and they\'ll get back to you as soon as possible.');
    },
    function (session, results) {
        if (results) {
            session.send('Thanks, I\'ll make sure a human gets this message!');
        }
    }
]).triggerAction({
    matches: /^help*$/i,
});

bot.dialog('NextTrain', [
    function (session, args, next) {
        var station = builder.EntityRecognizer.findEntity(args.intent.entities, 'station');
        if (station) {
            console.log(station);
            session.send('Looking up trains at ' + station.entity);
            session.conversationData.station = station.entity;
            next();
        } else if (getUsersDefaultStations(session, session.message.address)) {
            session.beginDialog('GetLocation');
        } else {
            sendMessageWithActions('Please specify a station or register to save default stations for next time.');
        }
    },
    function (session, results) {
        console.log(results);
        if (results) {
            session.conversationData.station = results.response.entity;
        }
        session.send('The next train for ' + session.conversationData.station + ' is scheduled for 4.41pm, however it is expected to arrive 4 minutes late.');
        session.beginDialog('ReceiveNotifications');
    },
    function(session, results){
        if(results){
            session.send('Cool, I\'ll keep you posted if the expected arrival time changes.');
        }
    }
]).triggerAction({
    matches: 'NextTrain'
});

bot.dialog('ReceiveNotifications', [
    function(session){
        builder.Prompts.text(session, 'Would you like to receive notifications if this train is delayed?', 'Yes|No', { listStyle: builder.ListStyle.button });
    },
    function(session, results){
        session.endDialogWithResult(results);
    }
])

bot.dialog('GetLocation', [
    function (session) {
        builder.Prompts.choice(session, 'Assuming you\'re going your usual route, where are you leaving from?', 'Botanic|Lisburn', { listStyle: builder.ListStyle.button });
    },
    function(session, results){
        session.endDialogWithResult(results);
    }
]);

//Useful functions for re-use
function sendMenu(session) {
    builder.Prompts.choice(session, 'Here\'s a list of all the things I can do.', 'Register|Train Times|Train Prices|Get Help from a Human', { listStyle: builder.ListStyle.button })
}

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

function getUsersDefaultStations(session, userId) {
    return [builder.CardAction.imBack(session, 'botanic', 'Botanic'),
    builder.CardAction.imBack(session, 'lisburn', 'Lisburn')];
}