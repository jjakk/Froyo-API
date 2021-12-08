const { Router } = require('express');
// Controllers
const ContentController = require('../../controllers/ContentController');
const PostController = require('../../controllers/PostController');

const router = Router();

router.get('/', ContentController.getAll('posts'));
router.get('/:id', ContentController.getById('posts'));
router.get('/:id/comments', ContentController.getComments());
router.get('/:id/likes', ContentController.getLikes());
router.get('/:id/dislikes', ContentController.getDislikes());
router.post('/', PostController.post);
router.put('/:id', PostController.put);
router.delete('/:id', ContentController.deleteContent('posts'));
router.get('/:id/like', ContentController.liking());
router.get('/:id/dislike', ContentController.disliking());
router.put('/:id/like', ContentController.like('posts'));
router.put('/:id/dislike', ContentController.dislike('posts'));

module.exports = router;