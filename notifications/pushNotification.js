const { Expo } = require('expo-server-sdk');
const queryDB = require('../queries/queryDB');
let expo = new Expo();

const pushNotificaiton = async (recipients, message, data) => {
    // Create notification messages for all recipients
    let messages = [];
    for(const notificationToken of recipients){
        if(Expo.isExpoPushToken(notificationToken)){
            messages.push({
                to: notificationToken,
                sound: 'default',
                title: message.title,
                body: message.body,
                data: data,
            });
        }
    }

    // Send the notification to all the members
    const chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }
        catch (err) {
            return new Error(err.message);
        }
    }

    // Get the receipt IDs from the tickets
    let receiptIds = [];
    for (const ticket of tickets) {
        if (ticket.id) {
            receiptIds.push(ticket.id);
        }
    }

    // Get receipts
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);
    for (const chunk of receiptIdChunks) {
        try {
            let receipts = await expo.getPushNotificationReceiptsAsync(chunk);
            for (let receiptId in receipts) {
                const { status, message, details } = receipts[receiptId];

                if (status === 'ok') continue;

                else if (status === 'error') {
                    console.error(`There was an error sending a notification: ${message}`);
                    if (details && details.error) {
                        console.error(`The error code is ${details.error}`);
                        switch(detrails.error){
                            case 'DeviceNotRegistered':
                                await queryDB('notification_tokens', 'delete', { where: ['value'] }, [details.device]);
                                break;
                        }
                    }
                }
            }
        }
        catch (error) {
            console.error(error);
        }
    }
};

module.exports = pushNotificaiton;
