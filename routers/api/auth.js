const { Router } = require('express');
const AuthController = require('../../controllers/AuthController');

const router = Router();

router.post('/login', AuthController.login);
router.get('/emailTaken/:email', AuthController.emailTaken);
router.get('/usernameTaken/:username', AuthController.usernameTaken);

module.exports = router;