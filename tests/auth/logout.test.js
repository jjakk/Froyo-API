const request = require('supertest');
const app = require('../../app');

test('logging out', async () => {
    const response = await request(app).post("/auth/logout").send({});
    expect(response.statusCode).toBe(200);
});
