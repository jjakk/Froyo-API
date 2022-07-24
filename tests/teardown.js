const request = require('supertest');
const { testUser } = require('./testConstants');
const app = require('../app');

const teardown = async () => {
    const { headers: { authorization } } = await request(app).post('/auth/login').send({
        email: testUser.email,
        password: testUser.password
    });
    await request(app).delete('/users').set('Authorization', authorization);
}

module.exports = teardown;