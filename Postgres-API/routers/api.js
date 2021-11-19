const { Router } = require('express');
// API routers
const authRouter = require('./api/auth');
const usersRouter = require('./api/users');
const postsRouter = require('./api/posts');
const commentsRouter = require('./api/comments');
// Middleware
const requireAuth = require('../middleware/requireAuth');

const router = Router();

router.get('/', requireAuth, (req, res) => {
    res.status(200).send(req.user.id);
});
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter);

module.exports = router;