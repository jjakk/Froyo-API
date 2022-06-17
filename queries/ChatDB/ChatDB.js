const DB = require('./DB');
const Formatter = require('./Formatter');

class ChatDB extends DB{
    constructor(req, res) {
        super(req, res);

        const {
            members,
            title,
            expiration,
            text
        } = req.body;

        this.members = members;
        this.title = title;
        this.expiration = expiration;
        this.text = text;
        this.formatter = new Formatter();
    }

    validateCreateChat(){
        if(!this.members || !Array.isArray(this.members)) return 'Must provide array of member IDs';

        this.members.push(this.req.user.id);
        this.members = this.members.filter((val, ind, arr) => arr.indexOf(val) === ind);

        if(this.members.length < 2) return 'Must provide at least two different members';
    }

    async validateUpdateChat(chat_id){
        const [chat] = await this.queryDB('chats', 'get', { where: ['id'] }, [chat_id]);
        if(!chat) return "No chat found with that ID";

        const createValidationError = this.validateCreateChat();
        if(createValidationError) return createValidationError;
    }

    async validateGetChatById(chat_id){
        const [chat] = await this.queryDB('chats', 'get', { where: ['id'] }, [chat_id]);
        if(!chat) return "No chat found with that ID";
    }

    async validateGetMessageById(chat_id, message_id){
        const validateChatError = await this.validateGetChatById(chat_id);
        if(validateChatError) return validateChatError;
        
        const [message] = await this.queryDB('messages', 'get', { where: ['id'] }, [message_id]);
        if(!message) return "No message found with that ID";
    }

    async validateCreateMessage(chat_id){
        const getChatError = await this.validateGetChatById(chat_id);
        if(getChatError) return getChatError;

        if(!this.text) return 'Must provide text';
    }

    async validateUpdateMessage(chat_id, message_id){
        const getMessageError = await this.validateGetMessageById(chat_id, message_id);
        if(getMessageError) return getMessageError;

        const createMessageError = await this.validateCreateMessage(chat_id);
        if(createMessageError) return createMessageError;
    }

    async createChat() {
        const [chat] = await this.queryDB("chats", "post", { params: ['title', 'expiration'] }, [this.title, this.expiration]);

        for(let i = 0; i < this.members.length; i++){
            await this.queryDB("chat_membership", "post", { params: ['chat_id', 'user_id'] }, [chat.id, this.members[i]]);
        }

        return chat;
    };

    async updateChat(chat_id) {
        const [updatedChat] = await this.queryDB(
            "chats",
            "put",
            {
                params: ['title', 'expiration'],
                where: ['id']
            },
            [this.title, this.expiration, chat_id]
        );

        await this.queryDB('chat_membership', 'delete', { where: ['chat_id'] }, [chat_id]);
        for(let i = 0; i < this.members.length; i++){
            await this.queryDB("chat_membership", "post", { params: ['chat_id', 'user_id'] }, [chat_id, this.members[i]]);
        }

        return updatedChat;
    }

    async getPersonalChats(){
        const chat_memberships = await this.queryDB('chat_membership', 'get', { where: ['user_id'] }, [this.req.user.id]);

        let chats = [];
        for(let i = 0; i < chat_memberships.length; i++){
            let chat = await this.getChatById(chat_memberships[i].chat_id);
            chats.push(chat);
        }
        
        chats = this.formatter.formatChats(chats);

        return chats;
    }

    async getChatById(chat_id){
        let [chat] = await this.queryDB('chats', 'get', { where: ['id'] }, [chat_id]);
        chat = await this.formatter.formatChat(chat);
        return chat;
    }

    async deleteChat(chat_id){
        await this.queryDB('chat_membership', 'delete', { where: ['chat_id'] }, [chat_id]);
        await this.queryDB('messages', 'delete', { where: ['chat_id'] }, [chat_id]);
        await this.queryDB('chats', 'delete', { where: ['id'] }, [chat_id]);
        return 'Chat deleted';
    }

    async getMessage(message_id){
        let [message] = await this.queryDB('messages', 'get', { where: ['id'] }, [message_id]);
        message = this.formatter.formatMessage(message);
        return message;
    }

    async getChatMessages(chat_id){
        let messages = await this.queryDB('messages', 'get', { where: ['chat_id'] }, [chat_id]);
        messages = this.formatter.formatMessages(messages);
        return messages;
    }

    async createMessage(chat_id){
        const message = await this.queryDB('messages', 'post', { params: ['chat_id', 'author_id', 'text'] }, [chat_id, this.req.user.id, this.text]);
        return message;
    }

    async updateMessage(message_id){
        const [message] = await this.queryDB('messages', 'put', { params: ['text'], where: ['id'] }, [this.text, message_id]);
        return message;
    }

    async deleteMessage(message_id){
        await this.queryDB('messages', 'delete', { where: ['id'] }, [message_id]);
        return 'Message deleted';
    }
}

module.exports = ChatDB;
