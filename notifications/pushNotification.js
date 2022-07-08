const { Expo } = require('expo-server-sdk');
let expo = new Expo();

const pushNotificaiton = (recipients, message, data) => {
    // Create notification messages for all recipients
    let messages = [];
    for(const recipient of recipients){
        const { notificationToken } = recipient.handshake.auth;
        console.log(notificationToken);
        if(Expo.isExpoPushToken(notificationToken)){
            messages.push({
                to: notificationToken,
                sound: 'default',
                body: message,
                data: data,
            });
        }
    }

    // Send the notification to all the members
    const chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (let chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }
        catch (err) {
            return new Error(err.message);
        }
    }
};

module.exports = pushNotificaiton;
