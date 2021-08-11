const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');

const router = express.Router();

router.get('/', (req, rest) => {

});


module.exports = router;
