const ChatDB = require('../queries/ChatDB/ChatDB');

const createChat = async (req, res) => {
    const chatDB = new ChatDB(req, res);

    const validationError = chatDB.validateCreateChat();
    if(validationError) return res.status(400).send(validationError);

    const chat = await chatDB.createChat();
    return res.status(201).send(chat);
}

const updateChat = async (req, res) => {
    const chatDB = new ChatDB(req, res);

    const validationError = await chatDB.validateUpdateChat(req.params.chat_id);
    if(validationError) return res.status(400).send(validationError);

    const chat = await chatDB.updateChat(req.params.chat_id);
    return res.status(201).send(chat);
}

const getPersonalChats = async (req, res) => {
    const chatDB = new ChatDB(req, res);

    const chats = await chatDB.getPersonalChats();
    return res.status(201).send(chats);
};

const getChatById = async (req, res) => {
    const chatDB = new ChatDB(req, res);
    
    const validationError = await chatDB.validateGetChatById(req.params.chat_id);
    if(validationError) return res.status(400).send(validationError);

    const chat = await chatDB.getChatById(req.params.chat_id);
    return res.status(201).send(chat);
};

const deleteChat = async (req, res) => {
    const chatDB = new ChatDB(req, res);
    
    const validationError = await chatDB.validateGetChatById(req.params.chat_id);
    if(validationError) return res.status(400).send(validationError);

    const response = await chatDB.deleteChat(req.params.chat_id);
    return res.status(201).send(response);
};

const createMessage = async (req, res) => {
    const chatDB = new ChatDB(req, res);
    
    const validationError = await chatDB.validateCreateMessage(req.params.chat_id);
    if(validationError) return res.status(400).send(validationError);

    const message = await chatDB.createMessage(req.params.chat_id);
    return res.status(201).send(message);
};

const getMessageById = async (req, res) => {
    const chatDB = new ChatDB(req, res);

    const {
        chat_id,
        message_id
    } = req.params;
    
    const validationError = await chatDB.validateGetMessageById(chat_id, message_id);
    if(validationError) return res.status(400).send(validationError);

    const message = await chatDB.getMessage(message_id);
    return res.status(201).send(message);
};

const getChatMessages = async (req, res) => {
    const chatDB = new ChatDB(req, res);
    
    const validationError = await chatDB.validateGetChatById(req.params.chat_id);
    if(validationError) return res.status(400).send(validationError);

    const chat = await chatDB.getChatMessages(req.params.chat_id);
    return res.status(201).send(chat);
};

const updateMessage = async (req, res) => {
    const chatDB = new ChatDB(req, res);

    const {
        chat_id,
        message_id
    } = req.params;
    
    const validationError = await chatDB.validateUpdateMessage(chat_id, message_id);
    if(validationError) return res.status(400).send(validationError);

    const message = await chatDB.updateMessage(message_id);
    return res.status(201).send(message);
};

const deleteMessage = async (req, res) => {
    const chatDB = new ChatDB(req, res);

    const {
        chat_id,
        message_id
    } = req.params;
    
    const validationError = await chatDB.validateGetMessageById(chat_id, message_id);
    if(validationError) return res.status(400).send(validationError);

    const message = await chatDB.deleteMessage(message_id);
    return res.status(201).send(message);
};

module.exports = {
    createChat,
    updateChat,
    getPersonalChats,
    getChatById,
    deleteChat,
    createMessage,
    getMessageById,
    getChatMessages,
    updateMessage,
    deleteMessage
};
