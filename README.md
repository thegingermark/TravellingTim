# Travelling Tim #
A chatbot created for the Timon Hackathon in January 2018 - Uses open data from Translink NI to get scheduled train times and expected train times.

## Pre-Requisites ##
* Node & npm
* Azure Bot Service - registration Subscription
* Luis.ai account and application
* ngrok

## How to set up ##
* Run the following command:
```
ngrok http 3979
```

* Copy the https link generated.

* For info on how to register a chatbot on Azure Bot Service, read here: `https://docs.microsoft.com/en-us/bot-framework/bot-service-quickstart-registration`
This is necessary for the chatbot to function.

* Add the ngrok link as the chatbot's messaging endpoint on Azure Bot Service

* Once you've registered a chatbot on azure, create a .env file in the root directory and add the following key references - set them to the app id and app password from the previous step.
```
MICROSOFT_APP_ID=
MICROSOFT_APP_PASSWORD=
LUIS_MODEL_URL=
```
* You will need to create a new project on `luis.ai` and train it to respond to the following intents:
```
'Greeting' - e.g. 'Hello', 'Hi'
'NextTrain' - e.g. 'when is the next train from Belfast Central?'
'Price' - e.g. 'How much is a train ticket from Belfast Central to Lisburn?'
'Goodbye' - e.g. 'Goodbye', 'Cya'
'Form' - e.g. 'What's up?', 'How are you?'
```
Publish the model and use the endpoint in the previous step for the variable `LUIS_MODEL_URL`

* Next add a DirectLine channel to your chatbot on Azure Bot Service, instructions found here:
`https://docs.microsoft.com/en-us/bot-framework/bot-service-channel-connect-directline`

* Using the secret key generated for the DirectLine channel, add this to `public/js/script.js` where the secret key reference is mentioned

* In terminal, cd to the root directory of this repository and run the following commands:
```
npm install -s botbuilder
npm install -s express
npm install -s body-parser
npm install -s request
npm install -s dotenv
```

* In a browser, navigate to `localhost:3979` and say `hi` to travelling tim
