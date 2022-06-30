const { Router } = require('express');
// API routers
const rootRouter = require('./api/root');
const authRouter = require('./api/auth');
const usersRouter = require('./api/users');
const imagesRouter = require('./api/images');
const feedRouter = require('./api/feed');
const postsRouter = require('./api/posts');
const commentsRouter = require('./api/comments');
const contentsRouter = require('./api/contents');
const chatsRouter = require('./api/chats');
// Middleware
const requireAuth = require('../middleware/requireAuth');
const getTargetResource = require('../middleware/getTargetResource');

const router = Router();

router.use(getTargetResource);
router.use('/', requireAuth, rootRouter);
router.use('/feed', requireAuth, feedRouter);
router.use('/posts', requireAuth, contentsRouter, postsRouter);
router.use('/comments', requireAuth, contentsRouter, commentsRouter);
router.use('/contents', requireAuth, contentsRouter);
router.use('/chats', requireAuth, chatsRouter);
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/images', imagesRouter);

module.exports = router;