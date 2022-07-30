const request = require('supertest');
const app = require('../app');

const testUser = {
    email: "jester@jak.bz",
    username: "jester",
    dob: new Date("November 23, 1995"),
    first_name: "jester",
    last_name: "lester",
    password: "password"
}

const getAuthToken = async () => {
    const { headers: { authorization } } = await request(app)
        .post('/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password
        });
    return authorization;
}

const TEST_CONSTANTS = {
    testUser,
    getAuthToken
};

module.exports = TEST_CONSTANTS;
