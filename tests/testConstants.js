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

const getTestUserAuthToken = async () => {
    const { headers: { authorization } } = await request(app)
        .post('/auth/login')
        .send({
            email: testUser.email,
            password: testUser.password
        });
    return authorization;
}

const getTestUserId = async () => {
    const res = await request(app).get('/').send({}).set('Authorization', await getTestUserAuthToken());
    return res.text;
}

const TEST_CONSTANTS = {
    testUser,
    getTestUserAuthToken,
    getTestUserId
};

module.exports = TEST_CONSTANTS;
