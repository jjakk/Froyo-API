const { Router } = require('express');

// Controller
const {
    getImage
} = require('../../controllers/ImagesController');

const router = Router();

router.get('/:key', getImage);

module.exports = router;