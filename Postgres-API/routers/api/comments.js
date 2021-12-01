const { Router } = require('express');
const CommentController = require('../../controllers/CommentController');

const router = Router();

router.get('/', CommentController.getAll);
router.get('/:id', CommentController.getById);
router.get('/:id/comments', CommentController.getComments);
router.post('/', CommentController.post);
router.put('/:id', CommentController.put);
router.delete('/:id', CommentController.deleteComment);

module.exports = router;