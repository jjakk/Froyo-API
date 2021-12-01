const { Router } = require('express');
const ContentController = require('../../controllers/ContentController');
const CommentController = require('../../controllers/CommentController');

const router = Router();

router.get('/', ContentController.getAll('comments'));
router.get('/:id', ContentController.getById('comments'));
router.get('/:id/comments', ContentController.getComments);
router.post('/', CommentController.post);
router.put('/:id', CommentController.put);
router.delete('/:id', ContentController.deleteContent('comments'));
router.put('/:id/like', ContentController.like('comments'));
router.put('/:id/dislike', ContentController.dislike('comments'));

module.exports = router;