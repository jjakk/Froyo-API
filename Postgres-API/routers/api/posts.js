const { Router } = require('express');
// Controller
const ContentController = require('../../controllers/ContentController');
const PostController = require('../../controllers/PostController');

const router = Router();

router.get('/', PostController.getAll);
router.get('/:id', PostController.getById);
router.get('/:id/comments', ContentController.getComments);
router.post('/', PostController.post);
router.put('/:id', PostController.put);
router.delete('/:id', PostController.deletePost);
router.put('/:id/like', PostController.like);
router.put('/:id/dislike', PostController.dislike);

module.exports = router;