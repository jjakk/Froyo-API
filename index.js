require('./models/User');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRouter = require('./routers/authRouter');
const requireAuth = require('./middleware/requireAuth');
const app = express();
const PORT = process.env.PORT || 8000;
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(authRouter);

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

app.get('/', requireAuth, (req, res) => {
    const { email, username } = req.user;
    res.send({ email, username });
});

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});