const { Router } = require('express');
const multer = require('multer');
const router = Router();
// Middleware
const upload = multer({ dest: 'uploads/' });
const requireAuth = require('../../middleware/requireAuth');
// Controller
const {
    queryUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getConnections,
    getFollowing,
    followUserById
} = require('../../controllers/UserController');

router.get('/', requireAuth, queryUsers);
router.get('/:id', requireAuth, getUserById);
router.post('/', createUser);
router.put('/', requireAuth, upload.single('image'), updateUser);
router.delete('/', requireAuth, deleteUser);
router.get('/:id/connections', requireAuth, getConnections)
router.get('/:follower_id/following/:followee_id', requireAuth, getFollowing);
router.put('/:id/follow', requireAuth, followUserById);

module.exports = router;