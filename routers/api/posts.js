const { Router } = require('express');
// Controllers
// Content Controller
const {
    getAll,
    getById,
    getComments,
    getLikes,
    getDislikes,
    deleteContent,
    liking,
    disliking,
    like,
    dislike
} = require('../../controllers/ContentController');
// Post Controller
const {
    post,
    put,
} = require('../../controllers/PostController');

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/comments', getComments);
router.get('/:id/likes', getLikes);
router.get('/:id/dislikes', getDislikes);
router.post('/', post);
router.put('/:id', put);
router.delete('/:id', deleteContent);
router.get('/:id/like', liking);
router.get('/:id/dislike', disliking);
router.put('/:id/like', like);
router.put('/:id/dislike', dislike);

module.exports = router;