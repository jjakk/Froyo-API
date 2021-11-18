const { Router } = require('express');
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

router.get('/', requireAuth, (req, res) => {
    res.send(req.user.id);
});

module.exports = router;