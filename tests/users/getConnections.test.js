const request = require('supertest');
const {
    testUsers,
    getTestUserId,
    getTestUserAuthToken
} = require('../testConstants');
const app = require('../../app');

test('Not  signed in', async () => {
    const attemptedId = await getTestUserId(0);
    const response = await request(app).get(`/users/${attemptedId}/connections`)
    expect(response.text).toBe('You\'re not logged in');
    expect(response.statusCode).toBe(200);
});

test('No connections', async () => {
    const attemptedId = await getTestUserId(0);
    const response = await request(app).get(`/users/${attemptedId}/connections`).set('Authorization', await getTestUserAuthToken(0));
    expect(response.body.followers).toStrictEqual([]);
    expect(response.body.following).toStrictEqual([]);
    expect(response.statusCode).toBe(200);
});

/*test('following one', async () => {
    const attemptedId = await getTestUserId(0);
    await request(app).put()
    const response = await request(app).get(`/users/${attemptedId}/connections`).set('Authorization', await getTestUserAuthToken(0));
    expect(response.body.followers).toStrictEqual([]);
    expect(response.body.following).toStrictEqual([]);
    expect(response.statusCode).toBe(200);
});*/