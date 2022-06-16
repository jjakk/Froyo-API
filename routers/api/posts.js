const { Router } = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Controller
const {
    createPost,
    updatePost,
} = require('../../controllers/PostsController');

const router = Router();

router.post('/', upload.array('images', 10), createPost);
router.put('/:id', upload.array('images', 10), updatePost);

module.exports = router;