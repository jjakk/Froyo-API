const request = require('supertest');
const {
    getTestUserId,
    getTestUserAuthToken
} = require('../testConstants');
const app = require('../../app');

test('Not  signed in', async () => {
    const firstUserId = await getTestUserId(0);
    const secondUserId = await getTestUserId(1);

    const response = await request(app).get(`/users/${firstUserId}/following/${secondUserId}`);

    expect(response.text).toBe('You\'re not logged in');
    expect(response.statusCode).toBe(200);
});

test('Invalid first user ID format', async () => {
    const firstUserId = 'invalidId';
    const secondUserId = await getTestUserId(1);

    const response = await request(app).get(`/users/${firstUserId}/following/${secondUserId}`).set('Authorization', await getTestUserAuthToken(0));

    expect(response.text).toBe(`invalid input syntax for type uuid: "${firstUserId}"`);
    expect(response.statusCode).toBe(400);
});

test('Invalid second user ID format', async () => {
    const firstUserId = await getTestUserId(0);
    const secondUserId = 'invalidId';

    const response = await request(app).get(`/users/${firstUserId}/following/${secondUserId}`).set('Authorization', await getTestUserAuthToken(0));

    expect(response.text).toBe(`invalid input syntax for type uuid: "${secondUserId}"`);
    expect(response.statusCode).toBe(400);
});

test('First user is not following second user', async () => {
    const firstUserId = await getTestUserId(0);
    const secondUserId = await getTestUserId(1);

    const response = await request(app).get(`/users/${firstUserId}/following/${secondUserId}`).set('Authorization', await getTestUserAuthToken(0));

    expect(response.body).toBe(false);
    expect(response.statusCode).toBe(200);
});



