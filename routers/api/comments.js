const { Router } = require('express');
// Controller
const {
    createComment,
    updateComment
} = require('../../controllers/CommentsController');

const router = Router();

router.post('/', createComment);
router.put('/:id', updateComment);

module.exports = router;