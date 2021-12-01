const { Router } = require('express');
const router = Router();
// Controller
const UserController = require('../../controllers/UserController');

router.get('/:id', UserController.getById);
router.get('/', UserController.getAllUsers);
router.get('/:id/posts', UserController.getPosts);
router.post('/', UserController.post);
router.put('/', UserController.put);
router.delete('/', UserController.deleteUser);
router.put('/:id/follow', UserController.follow);
router.get('/:user_a_id/following/:user_b_id', UserController.getFollowing);

module.exports = router;