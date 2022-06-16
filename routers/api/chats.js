const { Router } = require('express');
// Controller
const {
    createChat,
    updateChat,
    getChat,
    createMessage,
    updateMessage,
    getMessage
} = require('../../controllers/ChatsController');

const router = Router();

router.post('/', createChat);
router.put('/:chat_id', updateChat);
router.post('/:chat_id', getChat);
router.post('/:chat_id/messages', createMessage);
router.put('/:chat_id/messages', updateMessage);
router.get('/:chat_id/messages/:message_id', getMessage);

module.exports = router;