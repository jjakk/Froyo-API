const { Router } = require('express');
const {
    login,
    validEmail,
    validUsername
} = require('../../controllers/AuthController');

const router = Router();

router.post('/login', login);
router.get('/validEmail/:email', validEmail);
router.get('/validUsername/:username', validUsername);

module.exports = router;