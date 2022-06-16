const { Router } = require('express');
// Controller
const {
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
} = require('../../controllers/ChatsController');

const router = Router();

router.post('/', createChat);
router.put('/:chat_id', updateChat);
router.get('/', getPersonalChats);
router.get('/:chat_id', getChatById);
router.delete('/:chat_id', deleteChat);
router.post('/:chat_id/messages', createMessage);
router.get('/:chat_id/messages/:message_id', getMessageById);
router.get('/:chat_id/messages', getChatMessages);
router.put('/:chat_id/messages/:message_id', updateMessage);
router.delete('/:chat_id/messages/:message_id', deleteMessage);

module.exports = router;