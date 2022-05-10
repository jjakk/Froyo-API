const express = require('express');
const app = express();
require('dotenv').config();
// Routers
const apiRouter = require('./routers/api');
// Constants
PORT = process.env.PORT || 8000;

// App configuration
app.set('views', './views');
app.set('view engine', 'pug');

// Middleware
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({
    extended: true,
    limit: '50mb'
}));
app.use('/', apiRouter);

module.exports = app;