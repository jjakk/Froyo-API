const { Router } = require('express');
const multer = require('multer');
const router = Router();
// Middleware
const upload = multer({ dest: 'uploads/' });
const requireAuth = require('../../middleware/requireAuth');
// Controller
const {
    get,
    getById,
    getFollowing,
    post,
    put,
    follow,
    deleteUser
} = require('../../controllers/UserController');

router.get('/', requireAuth, get);
router.get('/:id', requireAuth, getById);
router.get('/:follower_id/following/:followee_id', requireAuth, getFollowing);
router.post('/', post);
router.put('/', requireAuth, upload.single('image'), put);
router.put('/:id/follow', requireAuth, follow);
router.delete('/', requireAuth, deleteUser);

module.exports = router;