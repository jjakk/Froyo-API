const { Router } = require('express');
const queries = require('../../queries/queries');
const pool = require('../../db');
// Require Auth
const requireAuth = require('../../middleware/requireAuth');

const router = Router();

// GET a specific post by ID
router.get('/:id', (req, res) => {

});

// Create (POST) a new post
router.post('/', requireAuth, (req, res) => {
    try {
        const {
            text,
            image_url
        } = req.body;
    
        console.log([text, image_url, req.user.id]);
    
        // Confirm that text isn't empty
        if (!text) return res.status(400).send('Must provide text body');
    
        pool.query(queries.posts.create, [text, image_url, req.user.id], (err, result) => {
            if (err) return res.status(500).send(err);
            if (!result.rows[0]) return res.status(400).send('Nothing to send back');
            return res.status(201).send(result.rows[0]);
        });
    }
    catch (err) {
        return res.status(500).send(err);
    }
});

module.exports = router;