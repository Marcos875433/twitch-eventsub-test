const express = require('express')
const crypto = require('crypto');
const twitchSigningSecret = 'cabezadetornilloazul';
exports.handler = async (event) => {
    const { headers = [] } = event;
    
    const type = headers['twitch-eventsub-message'] || 'no type';
    const eventType = headers['twitch-eventsub-subscription-type']
    const verifyTwitchSignature = (req, res, buf, encoding) => {
        const messageId = headers["Twitch-Eventsub-Message-Id"];
        const timestamp = headers["Twitch-Eventsub-Message-Timestamp"];
        const messageSignature = headers["Twitch-Eventsub-Message-Signature"];
        const time = Math.floor(new Date().getTime() / 1000);
        console.log(`Message ${messageId} Signature: `, messageSignature);
      
        if (Math.abs(time - timestamp) > 600) {
          // needs to be < 10 minutes
          console.log(`Verification Failed: timestamp > 10 minutes. Message Id: ${messageId}.`);
          throw new Error("Ignore this request.");
        }
      
        if (!twitchSigningSecret) {
          console.log(`Twitch signing secret is empty.`);
          throw new Error("Twitch signing secret is empty.");
        }
      
        const computedSignature =
          "sha256=" +
          crypto
            .createHmac("sha256", twitchSigningSecret)
            .update(messageId + timestamp + buf)
            .digest("hex");
        console.log(`Message ${messageId} Computed Signature: `, computedSignature);
      
        if (messageSignature !== computedSignature) {
          throw new Error("Invalid signature.");
        } else {
          console.log("Verification successful");
        }
    };

    app.use(express.json({ verify: verifyTwitchSignature }));

    app.post('/', async (req, res) => {
    const messageType = headers['twitch-eventsub-message-type'];
    if (messageType === 'webhook_callback_verification') {
        console.log('Verifying Webhook');
        return res.status(200).send(req.body.challenge);
    }

    const { type } = req.body.subscription;
    const { event } = req.body

    console.log(
        `Receiving ${type} request for ${event.broadcaster_user_name}: `,
        event
    );

    res.status(200).end();
    });

    const listener = app.listen(port, () => {
        console.log('Your app is listening on port ' + listener.address().port);
    });

    if (eventType !== 'channel.subscription.message') {
        return {statusCode:200, body: 'c'};
    }

    console.log({
        headers: event.headers,
        body: event.body
    })
    
    const { event: twitchEvent } = JSON.parse(event.body);
    const user = twitchEvent.user_name;

    console.log(user)
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            type,
            message: 'ok',          
        }),
    };
};