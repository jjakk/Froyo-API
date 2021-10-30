const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    // ID reference of user who created the comment
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // ID reference of Post or comment that this comment is for
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    // Text content of the comment
    body: {
        type: String,
        required: true,
        min: 1,
        max: 1000
    },
    likes: {
        type: Array,
        default: [],
    },
    dislikes: {
        type: Array,
        default: [],
    },
    comments: {
        type: Array,
        default: [],
    },
    timestamp: {
        type : Date,
        default: Date.now
    }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;