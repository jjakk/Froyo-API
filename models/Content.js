// This is the model for user created content
// Posts & comments are children of this model

const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    // ID reference of user who created this content
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Text body of the content
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
    // When content was created
    timestamp: {
        type : Date,
        default: Date.now
    }
});

const Content = mongoose.model('Content', contentSchema);

module.exports = { Content, contentSchema };