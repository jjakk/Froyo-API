const { Router } = require('express');
const pool = require('../../db');
const queries = require('../../queries/queries');

const router = Router();

router.get('/login', (req, res) => {
    const { email, password } = req.body;

    // Confirm that email and password aren't empty
    switch (''){
        case email:
            return res.status(400).send('Must provide email');
        case password:
            return res.status(400).send('Must provide password');
    }

    
});

module.exports = router;