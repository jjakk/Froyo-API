const { Router } = require('express');
const multer = require('multer');
const upload = multer({ dest: '../../uploads/' });
// Controller
const {
    post,
    put,
} = require('../../controllers/PostController');

const router = Router();

router.post('/', upload.array('images', 10), post);
router.put('/:id', put);

module.exports = router;