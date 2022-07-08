const queryDB = require('../queries/queryDB');

const deleteNotificationToken = async (tokenValue) => {
    await queryDB('notification_tokens', 'delete', { where: ['value'] }, [tokenValue]);
};

module.exports = deleteNotificationToken;