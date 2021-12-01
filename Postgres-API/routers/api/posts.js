const { Router } = require('express');
// Controller
const ContentController = require('../../controllers/ContentController');
const PostController = require('../../controllers/PostController');

const router = Router();

router.get('/', ContentController.getAll('posts'));
router.get('/:id', ContentController.getById('posts'));
router.get('/:id/comments', ContentController.getComments);
router.post('/', PostController.post);
router.put('/:id', PostController.put);
router.delete('/:id', ContentController.deleteContent('posts'));
router.put('/:id/like', PostController.like);
router.put('/:id/dislike', PostController.dislike);

module.exports = router;