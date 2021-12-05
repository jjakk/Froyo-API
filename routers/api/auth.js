const { Router } = require('express');
const AuthController = require('../../controllers/AuthController');

const router = Router();

router.post('/login', AuthController.login);
router.get('/validEmail/:email', AuthController.validEmail);
router.get('/validUsername/:username', AuthController.validUsername);

module.exports = router;