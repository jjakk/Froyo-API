const { Router } = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
// Controller
const {
    post,
    put,
} = require('../../controllers/PostsController');

const router = Router();

router.post('/', upload.array('images', 10), post);
router.put('/:id', upload.array('images', 10), put);

module.exports = router;