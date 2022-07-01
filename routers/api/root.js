const { Router } = require('express');
const { getRoot, getTakeout } = require('../../controllers/RootController/RootController');

const router = Router();

router.get('/', getRoot);
router.get('/takeout', getTakeout);

module.exports = router;