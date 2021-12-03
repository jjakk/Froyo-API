// Controller for both types of content (post & comment)
const queryDB = require('../queries/queryDB');
const { capitalize } = require('../helpers/helpers');

// GET all the comments of either a post or a comment
const getComments = async (req, res) => {
    try {
        const { id: parentId } = req.params;
        const comments = await queryDB('comments', 'get', ['parent_id'], [parentId]);
        if (comments.length === 0) return res.status(404).send('No comments found');
        return res.status(200).send(comments);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Get either a post or comment by ID
const getById = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const typeName = type.slice(0, -1);
        const { id: contentId } = req.params;

        const [ content ] = await queryDB(type, 'get', { where: ['id'] }, [contentId]);
        if (!content) return res.status(404).send(`${typeName} not found`);
        return res.status(200).send(content);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Get all a user's posts or comments
const getAll = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const contents = await queryDB(type, 'get', { where: ['author_id'] }, [req.user.id]);
        if (contents.length === 0) return res.status(404).send(`No ${type} found`);
        return res.status(200).send(contents);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
}

// Delete a post or comment by ID
const deleteContent = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const typeName = type.slice(0, -1);

        const { id: contentId } = req.params;

        // Check that the post exists in the database
        const [ post ] = await queryDB(type, 'get', { where: ['id'] }, [contentId]);
        if (!post) return res.status(404).send(`${capitalize(typeName)} not found`);

        // Make sure that it's the user's own post that their deleting
        if (post.author_id !== req.user.id) return res.status(403).send(`You can only delete your own ${type}`);

        // Delete all the post's comments
        await queryDB('comments', 'delete', { where: ['parent_id'] }, [contentId]);
    
        // Delete the post
        await queryDB(type, 'delete', { where: ['id'] }, [contentId]);
        return res.status(200).send(`${capitalize(typeName)} deleted`);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// Like (PUT) a post or comment by ID
const like = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const typeName = type.slice(0, -1);
        const { id: contentId } = req.params;

        // Check that the content exists in the database
        const [ content ] = await queryDB(type, 'get', { where: ['id'] }, [contentId]);
        if (!content) return res.status(404).send(`${capitalize(typeName)} not found`);
        
        // Check if a likeness already exists. If not, create one
        const [ likeness ] = await queryDB('likeness', 'get', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
        if (!likeness) {
            await queryDB('likeness', 'post', { params: ['user_id', 'content_id', 'like_content'] }, [req.user.id, contentId, true]);
            return res.status(201).send(`${capitalize(typeName)} liked`);
        }
        else {
            // User already likes the content -> unlike it (delete likeness)
            if (likeness.like_content) {
                await queryDB('likeness', 'delete', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
                return res.status(200).send(`${capitalize(typeName)} unliked`);  
            }
            // User currently dislikes the post -> change to like
            await queryDB('likeness', 'put', { params: ['like_content'], where: ['user_id', 'content_id'] }, [true, req.user.id, contentId]);
            return res.status(200).send(`${capitalize(typeName)} liked`);
        }
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

// Dslike (PUT) a post or comment by ID
const dislike = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const typeName = type.slice(0, -1);
        const { id: contentId } = req.params;

        // Check that the content exists in the database
        const [ content ] = await queryDB(type, 'get', { where: ['id'] }, [contentId]);
        if (!content) return res.status(404).send(`${capitalize(typeName)} not found`);
        
        // Check if a likeness already exists. If not, create one
        const [ likeness ] = await queryDB('likeness', 'get', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
        if (!likeness) {
            await queryDB('likeness', 'post', { params: ['user_id', 'content_id', 'like_content']}, [req.user.id, contentId, false]);
            return res.status(201).send(`${capitalize(typeName)} disliked`);
        }
        else {
            // User currently likes the content -> dislike it
            if (likeness.like_content) {
                await queryDB('likeness', 'put', { params: ['like_content'], where: ['user_id', 'content_id'] }, [false, req.user.id, contentId]);
                return res.status(200).send(`${capitalize(typeName)} disliked`);
            }
            // User already dislikes the post -> undislike it
            await queryDB('likeness', 'delete', { where: ['user_id', 'content_id'] }, [req.user.id, contentId]);
            return res.status(200).send(`${capitalize(typeName)} undisliked`);
        }
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

// Get the number of likes for a post or comment by ID
const getLikes = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const { id: contentId } = req.params;

        // Get all likes from the database with the given content ID
        const likes  = await queryDB('likeness', 'get', { where: ['content_id', 'like_content'] }, [contentId, true]);
        res.status(200).send(likes.length+'');
        
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
}

// Get the number of dislikes for a post or comment by ID
const getDislikes = (type) => async (req, res) => {
    try {
        if (type !== 'posts' && type !== 'comments') throw new Error('Invalid type');
        const { id: contentId } = req.params;

        // Get all dislikes from the database with the given content ID
        const dislikes = await queryDB('likeness', 'get', { where: ['content_id', 'like_content'] }, [contentId, false]);
        res.status(200).send(dislikes.length+'');
        
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

module.exports = {
    getComments,
    getAll,
    getById,
    deleteContent,
    like,
    dislike,
    getLikes,
    getDislikes
};