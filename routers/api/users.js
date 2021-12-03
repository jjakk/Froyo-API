const { Router } = require('express');
const router = Router();
const requireAuth = require('../../middleware/requireAuth');
// Controller
const UserController = require('../../controllers/UserController');

router.get('/:id', requireAuth, UserController.getById);
router.get('/', requireAuth, UserController.getAllUsers);
router.get('/:id/posts', requireAuth, UserController.getPosts);
router.get('/:follower_id/following/:followee_id', requireAuth, UserController.getFollowing);
router.post('/', UserController.post);
router.put('/', requireAuth, UserController.put);
router.put('/:id/follow', requireAuth, UserController.follow);
router.delete('/', requireAuth, UserController.deleteUser);

module.exports = router;