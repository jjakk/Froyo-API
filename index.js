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
app.use('/', apiRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

