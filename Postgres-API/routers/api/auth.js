const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Router } = require('express');
const pool = require('../../db');
const queries = require('../../queries/queries');

const router = Router();

router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // Confirm that email and password aren't empty
        switch (''){
            case email:
                return res.status(400).send('Must provide email');
            case password:
                return res.status(400).send('Must provide password');
        }

        // Query the database for the user
        pool.query(queries.users.getBy('email'), [email], async (err, result) => {
            if (err) return res.status(400).send(err);
            if(!result.rows[0]) return res.status(400).send('Email not found');

            // Verify the attempted password
            const validPass = await bcrypt.compare(password, result.rows[0].password);
            if(!validPass) return res.status(400).send('Invalid password');

            // Generate JWT token and attach to response header
            const token = jwt.sign({ userId: result.rows[0].id }, process.env.TOKEN_KEY);

            return res.status(201).set('authorization', `Bearer ${token}`).send(result.rows[0]);
        });
    }
    catch (err){
        return res.status(400).send(err);
    }
});

module.exports = router;