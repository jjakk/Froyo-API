const { Router } = require('express');
// Controllers
const {
    get,
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

const router = Router();

router.get('/', get);
router.get('/:id', getById);
router.get('/:id/comments', getComments);
router.get('/:id/likes', getLikes);
router.get('/:id/dislikes', getDislikes);
router.delete('/:id', deleteContent);
router.get('/:id/like', liking);
router.get('/:id/dislike', disliking);
router.put('/:id/like', like);
router.put('/:id/dislike', dislike);

module.exports = router;

