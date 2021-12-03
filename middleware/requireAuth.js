const jwt = require('jsonwebtoken');
const queryDB = require('../queries/queryDB');

const requireAuth = (req, res, next) => {
    try {
        const { Authorization } = req.headers; 

        // Check to see that the authorization is set
        if (!Authorization) return res.status(401).send("You're not logged in");

        // Get the token from authorization & verify it
        const token = Authorization.replace('Bearer ', '');
        jwt.verify(token, process.env.TOKEN_KEY, async (err, payload) => {
            if (err) return res.status(401).send('Invalid token');

            // Get user ID from token, and retrieve user from database
            const { userId } = payload;
            const [ user ] = await queryDB('users', 'get', { where: ['id'] }, [userId]);
            if (!user) return res.status(401).send('Invalid token');

            req.user = user;
            next();
        });
    }
    catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = requireAuth;