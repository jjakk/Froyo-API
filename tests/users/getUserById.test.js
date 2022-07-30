const request = require('supertest');
const {
    testUser,
    getTestUserId,
    getTestUserAuthToken
} = require('../testConstants');
const app = require('../../app');

test('Not signed in', async () => {
    const response = await request(app).get('/users/123');
    expect(response.text).toBe("You're not logged in");
    expect(response.statusCode).toBe(200);
});

test('Invalid user ID format', async () => {
    const attmeptedId = '123';
    const response = await request(app).get(`/users/${attmeptedId}`).set('Authorization', await getTestUserAuthToken());
    expect(response.text).toBe(`invalid input syntax for type uuid: "${attmeptedId}"`);
    expect(response.statusCode).toBe(400);
});

test("User doesn't exist", async () => {
    const attemptedId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app).get(`/users/${attemptedId}`).set('Authorization', await getTestUserAuthToken());
    expect(response.text).toBe('User not found');
    expect(response.statusCode).toBe(404);
});

test('Found a user', async () => {
    const attemptedId = await getTestUserId();
    console.log(attemptedId);
    const response = await request(app).get(`/users/${attemptedId}`).set('Authorization', await getTestUserAuthToken());
    expect(response.text).toBe(testUser);
    expect(response.statusCode).toBe(200);
})