const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.send(req.user.id);
});

module.exports = router;