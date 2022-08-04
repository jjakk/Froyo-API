const request = require('supertest');
const {
    testUsers,
    getTestUserAuthToken
} = require('./testConstants');
const app = require('../app');

const teardown = async () => {
    for(let i = 0; i < testUsers.length; i++){
        await request(app).delete('/users').set('Authorization', await getTestUserAuthToken(i));
    }
};

module.exports = teardown;