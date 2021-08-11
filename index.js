require('./models/User');
require('./models/Post');
require('./models/Comment');
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routers/auth');
const postsRouter = require('./routers/posts');
const usersRouter = require('./routers/users');
const requireAuth = require('./middleware/requireAuth');
const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/auth', authRouter);
app.use(requireAuth);
//app.use(requireAuth);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);

const mongoURI = `mongodb+srv://admin:${process.env.MONGO_PASSWORD}@cluster0.spbnq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to mongo instance');
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to mongo', err);
});

app.get('/', (req, res) => {
    const user = req.user;
    res.send(user._id);
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});