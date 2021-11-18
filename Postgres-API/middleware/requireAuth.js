const jwt = require('jsonwebtoken');
const pool = require('../db');
const queries = require('../queries/queries');

const requireAuth = (req, res, next) => {
    try {
        const { authorization } = req.headers; 

        // Check to see that the authorization is set
        if (!authorization) return res.status(401).send("You're not logged in");

        // Get the token from authorization & verify it
        const token = authorization.replace('Bearer ', '');
        jwt.verify(token, process.env.TOKEN_KEY, async (err, payload) => {
            if (err) return res.status(401).send('Invalid token');

            // Get user ID from token, and retrieve user from database
            const { userId } = payload;
            pool.query(queries.users.get('id'), [userId], (err, result) => {
                if (err) return res.status(500).send(err);

                // If the user is in the database add them to the request header
                if (result.rows[0]) {
                    req.user = result.rows[0];
                    next();
                }
                else{
                    return res.status(401).send('Invalid token');
                }
            });
        });
    }
    catch (err) {
        res.status(500).send(err);
    }
};

module.exports = requireAuth;