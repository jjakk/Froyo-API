const request = require('supertest');
const {
    testUsers,
    getTestUserAuthToken,
    getTestUserId
} = require('../testConstants');
const app = require('../../app');

test('Not signed in', async () => {
    const response = await request(app).get('/users');

    expect(response.text).toBe('You\'re not logged in');
    expect(response.statusCode).toBe(200);
});

test('Empty query', async () => {
    const response = await request(app).get('/users').set('Authorization', await getTestUserAuthToken(0));

    expect(response.body.length > 0).toBe(true);
    expect(response.statusCode).toBe(200);
});

test('Query invalid userId format', async () => {
    const userId = '123';
    const response = await request(app)
        .get(`/users?userId=${userId}`)
        .set('Authorization', await getTestUserAuthToken(0));

    expect(response.text).toBe(`invalid input syntax for type uuid: "${userId}"`);
    expect(response.statusCode).toBe(500);
});

test('Query non-existent userId format', async () => {
    const userId = '00000000-0000-0000-0000-000000000000';
    const response = await request(app)
        .get(`/users?userId=${userId}`)
        .set('Authorization', await getTestUserAuthToken(0));

    expect(response.text).toBe('User not found');
    expect(response.statusCode).toBe(404);
});

test('Get one user by their userId', async () => {
    const userId = await getTestUserId(0);
    const response = await request(app)
        .get(`/users?userId=${userId}`)
        .set('Authorization', await getTestUserAuthToken(0));

    expect(response.body.email).toBe(testUsers[0].email);
    expect(response.body.username).toBe(testUsers[0].username);
    expect(response.body.first_name).toBe(testUsers[0].first_name);
    expect(response.body.last_name).toBe(testUsers[0].last_name);
    expect(response.statusCode).toBe(200);
});

test('Get users by their first name', async () => {
    const firstName = testUsers[0].first_name;
    const response = await request(app)
        .get(`/users?text=${firstName}`)
        .set('Authorization', await getTestUserAuthToken(0));

    for(const user of response.body){
        expect(user.first_name).toBe(firstName);
    }
    expect(response.statusCode).toBe(200);
});

test('Get users by their last name', async () => {
    const lastName = testUsers[0].last_name;
    const response = await request(app)
        .get(`/users?text=${lastName}`)
        .set('Authorization', await getTestUserAuthToken(0));

    for(const user of response.body){
        expect(user.last_name).toBe(lastName);
    }
    expect(response.statusCode).toBe(200);
});

test('Get a user by their username', async () => {
    const username = testUsers[0].username;
    const response = await request(app)
        .get(`/users?text=${username}`)
        .set('Authorization', await getTestUserAuthToken(0));

    expect(response.body[0].username).toBe(username);
    expect(response.statusCode).toBe(200);
});

test('Query text that doesn\t exist for any users', async () => {
    const queryText = 'w9eahfiuwehfauwhfiauwehfiuahwefiuawhwfiuahweiufhawiuefhaiuwefhiauwehf';
    const response = await request(app)
        .get(`/users?text=${queryText}`)
        .set('Authorization', await getTestUserAuthToken(0));

    expect(response.body.length).toBe(0);
    expect(response.statusCode).toBe(200);
});