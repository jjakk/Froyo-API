const { Router } = require('express');

// Controller
const {
    get
} = require('../../controllers/ImagesController');

const router = Router();

router.get('/:key', get);

module.exports = router;