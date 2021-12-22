const { Router } = require('express');
// Controller
const {
    post,
    put
} = require('../../controllers/CommentController');

const router = Router();

router.post('/', post);
router.put('/:id', put);

module.exports = router;