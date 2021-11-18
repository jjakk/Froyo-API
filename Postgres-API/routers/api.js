const { Router } = require('express');
// API routers
const authRouter = require('./api/auth');
const usersRouter = require('./api/users');
const postsRouter = require('./api/posts');
const commentsRouter = require('./api/comments');

const router = Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);

module.exports = router;