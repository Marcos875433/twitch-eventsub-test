exports.handler = async (event) => {
    const { headers = [] } = event;
    
    const type = headers['twitch-eventsub-message'] || 'no type';
    const eventType = headers['twitch-eventsub-subscription-type']

    if (type !== 'notification' || eventType !== 'channel.subscription.message') {
        return {statusCode:200, body: ''};
    }

    console.log({
        headers: event.headers,
        body: event.body
    })
    
    const { event: twitchEvent } = JSON.parse(event.body);
    const user = twitchEvent.user_name;
    
    return {
        statusCode: 200,
        body: JSON.stringify({
            type,
            message: 'ok',          
        }),
    };
};