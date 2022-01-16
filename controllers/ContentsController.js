// Database queries
const queryDB = require('../queries/queryDB');
// Getters
const getContents = require('../queries/getters/getContents');
const getLikeness = require('../queries/getters/getLikeness');
// Putters
const putLikeness = require('../queries/putters/putLikeness');
// helpers
const deleteComments = require('../helpers/resursiveDeletion/deleteComments');
// GET all the comments of either a post or a comment
const getComments = async (req, res) => {
    try {
        const { id: parentId } = req.params;
        const comments = await getContents('comments', { parent_id: parentId }, req.user);

        return res.status(200).send(comments);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Search posts & comments by query
const get = async (req, res) => {
    try {
        const { type } = req.resource;
        const contents = await getContents(type, req.query, req.user);

        return res.status(200).send(contents);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Get either a post or comment by ID
const getById = async (req, res) => {
    try {
        const {
            type,
            typeName
        } = req.resource;
        const { id: contentId } = req.params;

        const [ content ] = await getContents(type, { id: contentId }, req.user);
        if (!content) return res.status(404).send(`${typeName} not found`);

        return res.status(200).send(content);
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

// Delete a post or comment by ID
const deleteContent = async (req, res) => {
    try {
        const {
            type,
            typeName
        } = req.resource;
        const { id: contentId } = req.params;

        // Check that the content exists in the database
        const [ content ] = await getContents(type, { id: contentId }, req.user);
        if (!content) return res.status(404).send(`${typeName} not found`);

        // Make sure that it's the user's own content that their deleting
        if (content.author.id !== req.user.id) return res.status(403).send(`You can only delete your own ${type}`);

        // Delete all the content's comments recursively
        await deleteComments(contentId);

        // Delete all the content's likeness
        await queryDB('likeness', 'delete', { where: ['content_id'] }, [contentId]);
    
        // Delete the content itself
        await queryDB(type, 'delete', { where: ['id'] }, [contentId]);
        return res.status(200).send(`${typeName} deleted`);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// Like (PUT) a post or comment by ID
const like = async (req, res) => {
    try {
        const {
            type,
            typeName
        } = req.resource;
        const { id: contentId } = req.params;

        // Check that the content exists in the database
        const [ content ] = await getContents(type, { id: contentId }, req.user);
        if (!content) return res.status(404).send(`${typeName} not found`);
        
        // Change the likeness accordingly
        await putLikeness(contentId, req.user, true);

        // Get and return updated content
        let [ updatedContent ] = await getContents(type, { id: contentId }, req.user);
        return res.status(200).send(updatedContent);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// Dslike (PUT) a post or comment by ID
const dislike = async (req, res) => {
    try {
        const {
            type,
            typeName
        } = req.resource;
        const { id: contentId } = req.params;

        // Check that the content exists in the database
        const [ content ] = await getContents(type, { id: contentId }, req.user);
        if (!content) return res.status(404).send(`${typeName} not found`);
        
        // Change the likeness accordingly
        await putLikeness(contentId, req.user, false);

        // Get and return updated content
        let [ updatedContent ] = await getContents(type, { id: contentId }, req.user);
        return res.status(200).send(updatedContent);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// Get the number of likes for a post or comment by ID
const getLikes = async (req, res) => {
    try {
        const { id: contentId } = req.params;

        const likes = await getLikeness(contentId, true);
        res.status(200).send(likes);
        
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

// Get the number of dislikes for a post or comment by ID
const getDislikes = async (req, res) => {
    try {
        const { id: contentId } = req.params;

        const dislikes = await getLikeness(contentId, false);
        res.status(200).send(dislikes);
        
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};

module.exports = {
    get,
    getById,
    getComments,
    deleteContent,
    like,
    dislike,
    getLikes,
    getDislikes
};