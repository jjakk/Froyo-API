const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.send('Getting comments');
});

module.exports = router;