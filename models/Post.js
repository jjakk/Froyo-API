const mongoose = require('mongoose');
const { contentSchema } = require('./Content');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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
    },
    images: {
        type: Array,
        default: [],
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;