const { Router } = require('express');
// API routers
const authRouter = require('./api/auth');
const usersRouter = require('./api/users');
const feedRouter = require('./api/feed');
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
router.use('/feed', requireAuth, feedRouter);
router.use('/posts', requireAuth, contentRouter, postsRouter);
router.use('/comments', requireAuth, contentRouter, commentsRouter);
router.use('/contents', requireAuth, contentRouter);

module.exports = router;