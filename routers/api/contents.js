const { Router } = require('express');
// Controllers
const {
    get,
    getById,
    getComments,
    deleteContent,
    like,
    dislike
} = require('../../controllers/ContentsController');

const router = Router();

router.get('/', get);
router.get('/:id', getById);
router.get('/:id/comments', getComments);
router.delete('/:id', deleteContent);
router.put('/:id/like', like);
router.put('/:id/dislike', dislike);

module.exports = router;

