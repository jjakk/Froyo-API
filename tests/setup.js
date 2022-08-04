const request = require('supertest');
const { testUsers } = require('./testConstants');
const app = require('../app');

const setup = async () => {
    for(const testUser of testUsers){
        await request(app).post("/users").send(testUser);
    }
};

module.exports = setup;