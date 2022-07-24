const request = require('supertest');
const { testUser } = require('./testConstants');
const app = require('../app');

const setup = async () => {
    await request(app).post("/users").send(testUser);
};

module.exports = setup;