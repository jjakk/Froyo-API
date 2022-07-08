const queryDB = require('../queries/queryDB');

const postNotificationToken = async (userId, token) => {
    const notificationTokens = await queryDB('notification_tokens', 'get', { where: ['user_id'] }, [userId]);
    let duplicate = false;
    notificationTokens.forEach(t => {
        if(t.value === token.value && t.user_id === token.user_id) duplicate = true;
    });
    if(!duplicate){
        await queryDB('notification_tokens', 'post', { params: ['user_id', 'value']}, [userId, token]);
    }
};

module.exports = postNotificationToken;