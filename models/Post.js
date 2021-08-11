const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String
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
    /*images: []*/
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;