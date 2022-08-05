const request = require('supertest');
const app = require('../../app');

test('Not signed in', async () => {
    const response = await request(app).get('/users');
    expect(response.text).toBe('You\'re not logged in');
    expect(response.statusCode).toBe(200);
});