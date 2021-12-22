const { Router } = require('express');
// API routers
const authRouter = require('./api/auth');
const usersRouter = require('./api/users');
const postsRouter = require('./api/posts');
const commentsRouter = require('./api/comments');
const contentRouter = require('./api/content');
// Middleware
const requireAuth = require('../middleware/requireAuth');
const getTargetResource = require('../middleware/getTargetResource');

const router = Router();

router.get('/', requireAuth, (req, res) => {
    res.status(200).send(req.user.id);
});
router.use(getTargetResource);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', requireAuth, postsRouter);
router.use('/comments', requireAuth, commentsRouter);
router.use('/content', requireAuth, contentRouter);

module.exports = router;