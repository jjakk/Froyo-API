// CRUD operations for posts
const queryDB = require('../queries/queryDB');
const uploadImages = require('../aws/uploadImages');

// Create a new post
// POST /
const post = async (req, res) => {
    try {
        const { text } = req.body;
        const { files } = req;
    
        // Confirm that text isn't empty
        if (!text) return res.status(400).send('Must provide text body');
    
        // Create the new post
        const [ newPost ] = await queryDB('posts', 'post', { params: ['text', 'author_id']}, [text, req.user.id]);

        // Store the posts's images on AWS, and store keys to the database
        await uploadImages(files, newPost);

        return res.status(201).send('Post created');
    }
    catch (err) {
        return res.status(err.status || 500).send(err.message);
    }
}

// Update a post by ID
// PUT /:id
const put = async (req, res) => {
    try {
        const { id: postId } = req.params;

        // imageKeysToDelete are a list of S3 keys of images to delete
        const {
            text,
            imageKeysToDelete
        } = req.body;
        console.log(imageKeysToDelete);
        
        // Files represent the new post images
        const {
            files
        } = req;
    
        // Confirm that text isn't empty
        if (!text) return res.status(400).send('Must provide text body');

        // Check that the post exists in the database
        const [ post ] = await queryDB('posts', 'get', { where: ['id'] }, [postId]);
        if (!post) return res.status(404).send('Post not found');

        // Make sure that it's the user's own post that their deleting
        if (post.author_id !== req.user.id) return res.status(403).send('You can only update your own posts');
    
        // Update the post text
        await queryDB('posts', 'put', { params: ['text'], where: ['id'] }, [text, postId]);

        // Remove images from the post if necessary
        if (imageKeysToDelete) {
            for(let i = 0; i < imageKeysToDelete.length; i++){
                await queryDB('images', 'delete', { where: ['bucket_key'] }, [imageKeysToDelete[i]]);
            }
        }

        // Upload new images to AWS & store keys to the database associated with this post
        await uploadImages(files, post);

        return res.status(200).send('Post updated');
    }
    catch (err) {
        return res.status(err.status || 500).send(err.message);
    }
}

module.exports = {
    post,
    put
};