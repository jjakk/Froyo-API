const { Router } = require('express');
// Controllers
const {
    queryContents,
    getContentById,
    getContentsComments,
    likeContent,
    dislikeContent,
    deleteContent
} = require('../../controllers/ContentsController');

const router = Router();

router.get('/', queryContents);
router.get('/:id', getContentById);
router.get('/:id/comments', getContentsComments);
router.put('/:id/like', likeContent);
router.put('/:id/dislike', dislikeContent);
router.delete('/:id', deleteContent);

module.exports = router;

