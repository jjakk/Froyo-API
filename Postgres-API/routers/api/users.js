const { Router } = require('express');
const router = Router();
// Controller
const UserController = require('../../controllers/UserController');

router.get('/:id', UserController.getById);
router.get('/', UserController.getAllUsers);
router.get('/:id/posts', UserController.getPosts);
router.get('/:user_a_id/following/:user_b_id', UserController.getFollowing);
router.post('/', UserController.post);
router.put('/', UserController.put);
router.put('/:id/follow', UserController.follow);
router.delete('/', UserController.deleteUser);

module.exports = router;