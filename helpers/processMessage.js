const API_AI_TOKEN = 'Your DIALOG FLOW API KEY HERE';
const FACEBOOK_ACCESS_TOKEN = 'YOUR FACEBOOK_ACCESS_TOKEN HERE';
const request = require('request');

const apiAiClient = require('apiai')(API_AI_TOKEN);


const sendTextMessage = (senderId, text) => {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: { text },
        }
    });
};

module.exports = (event) => {
    const senderId = event.sender.id;
    const message = event.message.text;

    const apiaiSession = apiAiClient.textRequest(message, {sessionId: 'botcube_co'});

    apiaiSession.on('response', (response) => {
        const result = response.result.fulfillment.speech;

        if (response.result.metadata.intentName === 'Default Welcome Intent') {
            sendTextMessage(senderId, result);
        } 
    });

    apiaiSession.on('error', error => console.log(error));
    apiaiSession.end();
};
