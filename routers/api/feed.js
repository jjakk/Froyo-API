const { Router } = require('express');
// Controller
const {
    get
} = require('../../controllers/FeedController');

const router = Router();

router.get('/', get);

module.exports = router;