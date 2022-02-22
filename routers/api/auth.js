const { Router } = require('express');
const {
    login,
    validEmail,
    validUsername,
    resetPassword,
    getPasswordReset
} = require('../../controllers/AuthController');

const router = Router();

router.post('/login', login);
router.get('/validEmail/:email', validEmail);
router.get('/validUsername/:username', validUsername);
router.post('/resetPassword', resetPassword);
router.get('/reset/:token', getPasswordReset);

module.exports = router;