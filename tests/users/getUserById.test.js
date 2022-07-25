const request = require('supertest');
const { testUser } = require('../testConstants');
const app = require('../../app');

test('Not signed in', async () => {
    const response = await request(app).get('/users/123');
    expect(response.text).toBe("You're not logged in");
    expect(response.statusCode).toBe(200);
});