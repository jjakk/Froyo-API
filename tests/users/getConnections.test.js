const request = require('supertest');
const {
    testUsers,
    getTestUserId,
    getTestUserAuthToken
} = require('../testConstants');
const app = require('../../app');

test('Not  signed in', async () => {
    const attemptedId = await getTestUserId(0);

    const response = await request(app).get(`/users/${attemptedId}/connections`);

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

test('following one', async () => {
    const signedInUser = await getTestUserId(0);
    const userToFollowId = await getTestUserId(1);

    await request(app).put(`/users/${userToFollowId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    const response = await request(app).get(`/users/${signedInUser}/connections`).set('Authorization', await getTestUserAuthToken(0));

    expect(response.body.followers).toStrictEqual([]);
    expect(response.body.following.length).toStrictEqual(1);
    expect(response.body.following[0].id).toStrictEqual(userToFollowId);
    expect(response.statusCode).toBe(200);

    await request(app).put(`/users/${userToFollowId}/follow`).set('Authorization', await getTestUserAuthToken(0));
});

test('following two', async () => {
    const signedInUser = await getTestUserId(0);
    const firstUserToFollowId = await getTestUserId(1);
    const secondUserToFollowId = await getTestUserId(2);

    await request(app).put(`/users/${firstUserToFollowId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    await request(app).put(`/users/${secondUserToFollowId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    const response = await request(app).get(`/users/${signedInUser}/connections`).set('Authorization', await getTestUserAuthToken(0));
    
    expect(response.body.followers).toStrictEqual([]);
    expect(response.body.following.length).toStrictEqual(2);
    expect(response.body.following[0].id).toStrictEqual(firstUserToFollowId);
    expect(response.body.following[1].id).toStrictEqual(secondUserToFollowId);
    expect(response.statusCode).toBe(200);

    await request(app).put(`/users/${firstUserToFollowId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    await request(app).put(`/users/${secondUserToFollowId}/follow`).set('Authorization', await getTestUserAuthToken(0));
});

test('followed by one', async () => {
    const signedInUser = await getTestUserId(0);
    const userToFollowId = await getTestUserId(1);

    await request(app).put(`/users/${userToFollowId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    const response = await request(app).get(`/users/${userToFollowId}/connections`).set('Authorization', await getTestUserAuthToken(0));

    expect(response.body.following).toStrictEqual([]);
    expect(response.body.followers.length).toStrictEqual(1);
    expect(response.body.followers[0].id).toStrictEqual(signedInUser);
    expect(response.statusCode).toBe(200);

    await request(app).put(`/users/${userToFollowId}/follow`).set('Authorization', await getTestUserAuthToken(0));
});

test('followed by two', async () => {
    const firstSignedInUserId = await getTestUserId(0);
    const secondSignedInUserId = await getTestUserId(1);
    const userGettingTheFollowersId = await getTestUserId(2);

    await request(app).put(`/users/${userGettingTheFollowersId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    await request(app).put(`/users/${userGettingTheFollowersId}/follow`).set('Authorization', await getTestUserAuthToken(1));
    const response = await request(app).get(`/users/${userGettingTheFollowersId}/connections`).set('Authorization', await getTestUserAuthToken(0));

    expect(response.body.following).toStrictEqual([]);
    expect(response.body.followers.length).toStrictEqual(2);
    expect(response.body.followers[0].id).toStrictEqual(firstSignedInUserId);
    expect(response.body.followers[1].id).toStrictEqual(secondSignedInUserId);
    expect(response.statusCode).toBe(200);

    await request(app).put(`/users/${userGettingTheFollowersId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    await request(app).put(`/users/${userGettingTheFollowersId}/follow`).set('Authorization', await getTestUserAuthToken(1));
});

test('two users follow one another', async () => {
    const firstUserId = await getTestUserId(0);
    const secondUserId = await getTestUserId(1);

    await request(app).put(`/users/${secondUserId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    await request(app).put(`/users/${firstUserId}/follow`).set('Authorization', await getTestUserAuthToken(1));

    let response = await request(app).get(`/users/${firstUserId}/connections`).set('Authorization', await getTestUserAuthToken(0));

    expect(response.body.followers.length).toStrictEqual(1);
    expect(response.body.followers[0].id).toStrictEqual(secondUserId);
    expect(response.body.followers.length).toStrictEqual(1);
    expect(response.body.followers[0].id).toStrictEqual(secondUserId);
    expect(response.statusCode).toBe(200);

    response = await request(app).get(`/users/${secondUserId}/connections`).set('Authorization', await getTestUserAuthToken(0));

    expect(response.body.followers.length).toStrictEqual(1);
    expect(response.body.followers[0].id).toStrictEqual(firstUserId);
    expect(response.body.followers.length).toStrictEqual(1);
    expect(response.body.followers[0].id).toStrictEqual(firstUserId);
    expect(response.statusCode).toBe(200);

    await request(app).put(`/users/${secondUserId}/follow`).set('Authorization', await getTestUserAuthToken(0));
    await request(app).put(`/users/${firstUserId}/follow`).set('Authorization', await getTestUserAuthToken(1));
});
