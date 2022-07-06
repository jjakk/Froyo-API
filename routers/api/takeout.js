const { Router } = require('express');

// Controller
const {
    getTakeout
} = require('../../controllers/TakeoutController/TakeoutController');

const router = Router();

router.get('/', getTakeout);

module.exports = router;