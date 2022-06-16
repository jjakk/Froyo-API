const { Router } = require('express');
// Controller
const {
    getFeed
} = require('../../controllers/FeedController');

const router = Router();

router.get('/', getFeed);

module.exports = router;