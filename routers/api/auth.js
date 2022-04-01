const { Router } = require('express');
const {
    login,
    validateParameter,
    sendResetPasswordEmail,
    resetPassword,
    renderResetPassword
} = require('../../controllers/AuthController');

const router = Router();

router.post('/login', login);
router.get('/validateParameter/:parameter/:value', validateParameter);
router.put('/resetPassword', sendResetPasswordEmail);
router.put('/reset/:token', resetPassword);
router.get('/reset/:token', renderResetPassword);

module.exports = router;