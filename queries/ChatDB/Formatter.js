const functionalQueryDB = require('../queryDB');

class Formatter{
    constructor() {}

    async queryDB(table, method, conditions, values){
        return await functionalQueryDB(table, method, conditions, values);
    }

    async formatChat(chat){
        let members = await this.queryDB('chat_membership', 'get', { where: ['chat_id'] }, [chat.id]);
        chat.members = members.map(membership=>membership.user_id);

        const {
            timestamp,
            ...restOfChat
        } = chat;

        return restOfChat;
    }

    async formatChats(chats){
        for(let i = 0; i < chats.length; i++){
            chats[i] = await this.formatChat(chats[i]);
        }
        return chats;
    }

    formatMessage(message){
        const {
            chat_id,
            ...restOfMessage
        } = message;
        return restOfMessage;
    }

    formatMessages(messages){
        return messages.map(message=>this.formatMessage(message));
    }
}

module.exports = Formatter;
