const { Router } = require('express');
const router = Router();
const requireAuth = require('../../middleware/requireAuth');
// Controller
const {
    getById,
    getAllUsers,
    getPosts,
    getFollowing,
    post,
    put,
    follow,
    deleteUser
} = require('../../controllers/UserController');

router.get('/:id', requireAuth, getById);
router.get('/', requireAuth, getAllUsers);
router.get('/:id/posts', requireAuth, getPosts);
router.get('/:follower_id/following/:followee_id', requireAuth, getFollowing);
router.post('/', post);
router.put('/', requireAuth, put);
router.put('/:id/follow', requireAuth, follow);
router.delete('/', requireAuth, deleteUser);

module.exports = router;