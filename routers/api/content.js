const { Router } = require('express');
// Controllers
const ContentController = require('../../controllers/ContentController');

const router = Router();

router.get('/', ContentController.getAll());
router.get('/:id', ContentController.getById());
router.get('/:id/comments', ContentController.getComments);
router.get('/:id/likes', ContentController.getLikes());
router.get('/:id/dislikes', ContentController.getDislikes());
router.delete('/:id', ContentController.deleteContent());
router.put('/:id/like', ContentController.like());
router.put('/:id/dislike', ContentController.dislike());

module.exports = router;

