const express = require('express');
const app = express();
require('dotenv').config();
// Routers
const apiRouter = require('./routers/api');
// Constants
PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('Go to /api for api functions');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

