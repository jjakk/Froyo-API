const { Router } = require('express');
const {
    login,
    validEmail,
    validUsername,
    sendResetPasswordEmail,
    resetPassword,
    renderResetPassword
} = require('../../controllers/AuthController');

const router = Router();

router.post('/login', login);
router.get('/validEmail/:email', validEmail);
router.get('/validUsername/:username', validUsername);
router.put('/resetPassword', sendResetPasswordEmail);
router.put('/reset/:token', resetPassword);
router.get('/reset/:token', renderResetPassword);

module.exports = router;