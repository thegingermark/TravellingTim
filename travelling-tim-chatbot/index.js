require('dotenv').load();
var builder = require('botbuilder');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var botMiddleware = require('./middleware');

const app = express();
app.use('/', express.static('public'));

var savedAddresses = [];

//Create express app
app.listen(process.env.port || process.env.PORT || 3979, function () {
    console.log('%s started', app.name);
});

//express middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

function requestStationScheduleTimeAt(session, station, traveldate) {
    var request = require('request');
    traveldate = new Date();
    traveldate = new Date(traveldate.setHours(20));

    var propertiesObject = { stationName: station, datetime: formatDate(traveldate) };
    request({url:'http://7bd6b0a6.ngrok.io/api/TrainData/GetTrainAtNearestTime', qs:propertiesObject}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var nexttrain = formatDateToTime(new Date(JSON.parse(body).data.scheduledTime));
            session.send('There is a train at ' + station + ' scheduled for ' + nexttrain + '.');
            botMiddleware.delayResponseTyping(session, 2);
            session.beginDialog('ReceiveNotifications');
        } else {
            console.log(error);
        }
    })
}

function requestStationSchedule(session, station) {
    var request = require('request');
    var propertiesObject = { stationName: station };
    request({url:'http://7bd6b0a6.ngrok.io/api/TrainData/GetTrainAtNearestTime', qs:propertiesObject}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body).data);
            var nexttrain = formatDateToTime(new Date(JSON.parse(body).data.scheduledTime));
            session.send('The next train for ' + session.conversationData.station + ' is scheduled for ' + nexttrain + '.');
            botMiddleware.delayResponseTyping(session, 2);
            session.beginDialog('ReceiveNotifications');
        }
    })
}

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
            session.send('Looking up trains from ' + station.entity);
            session.conversationData.station = station.entity;
            next();
        } else if (getUsersDefaultStations(session, session.message.address)) {
            botMiddleware.delayResponseTyping(session, 2);
            session.beginDialog('GetLocation');
        } else {
            botMiddleware.delayResponseTyping(session, 2);
            sendMessageWithActions('Please specify a station or register to save default stations for next time.');
        }
    },
    function (session, results) {
        console.log(results);
        if (results && !session.conversationData.station) {
            session.conversationData.station = results.response.entity;
        }
        botMiddleware.delayResponseTyping(session, 2);
        requestStationSchedule(session, session.conversationData.station);
    },
    function (session, results) {
        if (results) {
            session.send('Cool, I\'ll keep you posted if the expected arrival time changes.');
        }
    }
]).triggerAction({
    matches: 'NextTrain'
});

bot.dialog('NextTrainAt', [
    function (session, args, next) {
        var station = builder.EntityRecognizer.findEntity(args.intent.entities, 'station');

        var departureDate;
        if (builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date')) {
            departureDate = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.date');
        } else if (builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.datetime')) {
            departureDate = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.datetimeV2.datetime');
        }
        if (departureDate) {
            session.conversationData.date = departureDate.resolution.values[0].value;
        }

        if (station) {
            console.log(station);
            session.send('Looking up trains from ' + station.entity + ' at ' + session.conversationData.date);
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
        if (results && !session.conversationData.station) {
            session.conversationData.station = results.response.entity;
        }

        var traveldate = formatDate(new Date(session.conversationData.date));

        requestStationScheduleTimeAt(session, session.conversationData.station, traveldate);

    },
    function (session, results) {
        session.send('Cool, I\'ll keep you posted if the expected arrival time changes.');
        console.log('ADDRESS: ' + session.message.address);
        savedAddresses.push(session.message.address);
        console.log(savedAddresses);
        session.endDialog();
    }
]).triggerAction({
    matches: 'TrainAt'
});

bot.dialog('Price', [
    function (session) {
        session.send('The price between Botanic Train Station and Lisburn Train Station is £4.00 for a single and £6.20 for a return.');
        botMiddleware.delayResponseTyping(session, 2);
        session.send('You can get 1/3 off on your return ticket after 9.30am, which would make it £4.10.');
        botMiddleware.delayResponseTyping(session, 2);
        builder.Prompts.choice(session, 'Would you like to purchase one now?', 'Yes|No', { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        if (results) {
            session.send('to do - purchasing');
        }
    }
]).triggerAction({
    matches: 'Price',
});

bot.dialog('Bye', function (session) {
    session.endConversation('Thanks for dropping by!');
}).triggerAction({
    matches: 'Goodbye'
});

bot.dialog('Form', function (session) {
    session.endDialog('Sure the craic\'s ninety. What can I help you with?');
}).triggerAction({
    matches: 'Form'
})

bot.dialog('ReceiveNotifications', [
    function (session) {
        builder.Prompts.text(session, 'Would you like to receive notifications if this train is delayed?', 'Yes|No', { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
])

bot.dialog('GetLocation', [
    function (session) {
        builder.Prompts.choice(session, 'Assuming you\'re going your usual route, where are you leaving from?', 'Botanic|Lisburn', { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
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
                builder.CardAction.imBack(session, 'menu', 'Menu'),
                builder.CardAction.imBack(session, 'help', 'Help')
            ]
        )));
}

function getUsersDefaultStations(session, userId) {
    return [builder.CardAction.imBack(session, 'botanic', 'Botanic'),
    builder.CardAction.imBack(session, 'lisburn', 'Lisburn')];
}

app.post('/api/PushMessage/', (req, res, next) => {
    var responseText = '';
    var addresses = [];
    if (req.body.addresses) {
        for (var i = 0; i < savedAddresses.length; i++) {
            for (var c = 0; c < req.body.addresses.length; c++) {
                if (savedAddresses[i].id == req.body.addresses[c]["key"]) {
                    addresses.push(savedAddresses[i]);
                }
            }
        }
    } else {
        addresses = savedAddresses;
    }
    for (var i = 0; i < savedAddresses.length; i++) {
        var msg = new builder.Message().address(addresses[i]);
        msg.text(req.body.text);
        msg.textLocale('en-UK');
        bot.send(msg);
        responseText += 'Sent message: ' + req.params.text + ' to ' + addresses[i] + '\r\r';
    }
    res.send(responseText);
    next();
}
);

function formatDate(date) {
    var day = date.getDate();       // yields date
    var month = date.getMonth() + 1;    // yields month (add one as '.getMonth()' is zero indexed)
    var year = date.getFullYear();  // yields year
    var hour = date.getHours();     // yields hours 
    var minute = date.getMinutes(); // yields minutes
    var second = date.getSeconds(); // yields seconds
    
    // After this construct a string with the above results as below
    var time = day + "/" + month + "/" + year + " " + hour + ':' + minute + ':' + second; 
    return time;
  }

  function formatDateToTime(date){
    var day = date.getDate();       // yields date
    var month = date.getMonth() + 1;    // yields month (add one as '.getMonth()' is zero indexed)
    var year = date.getFullYear();  // yields year
    var hour = date.getHours();     // yields hours 
    var minute = date.getMinutes(); // yields minutes
    var second = date.getSeconds(); // yields seconds
    
    // After this construct a string with the above results as below
    var time = hour + ':' + minute; 
    return time;
  }