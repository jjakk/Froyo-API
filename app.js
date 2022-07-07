const express = require('express');
const { createServer } = require("http");
const { Server } = require("socket.io");
const { API_ENDPOINT } = require('@froyo-api/constants');
const app = express();
const httpServer = createServer(app);
require('dotenv').config();

// Routers
const apiRouter = require('./routers/api');
// Web Socket
const io = new Server(httpServer, { cors: { origin: [API_ENDPOINT] } });

io.on('connection', (socket) => {
    socket.on('join-room', (room) => {
        socket.join(room);
    });

    socket.on('send-message', (message, room) => {
        socket.to(room).emit('receive-message', message);
    });
});

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

module.exports = httpServer;