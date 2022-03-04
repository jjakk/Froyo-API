const express = require('express');
const app = express();
require('dotenv').config();
// Routers
const apiRouter = require('./routers/api');
// Constants
PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use('/', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

