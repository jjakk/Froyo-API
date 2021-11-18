const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
    res.send('Getting posts');
});

module.exports = router;