// CRUD operations for posts
const queryDB = require('../queries/queryDB');
const { uploadFile, unlinkFile } = require('../aws/s3');

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
        for (let i = 0; i < files.length; i++) {
            // Get key each uploaded file
            const { Key } = await uploadFile(files[i]);
            // Create a new image in the database
            await queryDB('images', 'post', { params: ['post_id', 'bucket_key']}, [newPost.id, Key]);
            // Remove temporary file from uploads directory
            await unlinkFile(files[i].path);
        }

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
        const {
            text,
            image_url
        } = req.body;
    
        // Confirm that text isn't empty
        if (!text) return res.status(400).send('Must provide text body');

        // Check that the post exists in the database
        const [ post ] = await queryDB('posts', 'get', { where: ['post_id'] }, [postId]);
        if (!post) return res.status(404).send('Post not found');

        // Make sure that it's the user's own post that their deleting
        if (post.author_id !== req.user.id) return res.status(403).send('You can only update your own posts');
    
        // Update the post
        await queryDB('posts', 'put', { params: ['text', 'image_url'], where: ['id'] }, [text, image_url, postId]);
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