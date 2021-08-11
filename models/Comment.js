const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        min: 1
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;