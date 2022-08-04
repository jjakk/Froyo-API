const request = require('supertest');
const app = require('../app');

const testUsers = [
    {
        email: "unitTestTester1@jak.bz",
        username: "Tester1",
        dob: new Date("November 23, 1995"),
        first_name: "unit1",
        last_name: "tester1",
        password: "password"
    }, {
        email: "unitTestTester2@jak.bz",
        username: "Tester2",
        dob: new Date("December 15, 2001"),
        first_name: "unit2",
        last_name: "tester2",
        password: "password"
    }, {
        email: "unitTestTester3@jak.bz",
        username: "Tester3",
        dob: new Date("December 15, 1998"),
        first_name: "unit3",
        last_name: "tester3",
        password: "password"
    }, {
        email: "unitTestTester4@jak.bz",
        username: "Tester4",
        dob: new Date("March 20, 1993"),
        first_name: "unit4",
        last_name: "tester4",
        password: "password"
    }, {
        email: "unitTestTester5@jak.bz",
        username: "Tester5",
        dob: new Date("April 16, 1996"),
        first_name: "unit5",
        last_name: "tester5",
        password: "password"
    }
];

const getTestUserAuthToken = async (userNumber) => {
    const { headers: { authorization } } = await request(app)
        .post('/auth/login')
        .send({
            email: testUsers[userNumber].email,
            password: testUsers[userNumber].password
        });
    return authorization;
};

const getTestUserId = async (userNumber) => {
    const res = await request(app)
        .get('/')
        .send({})
        .set('Authorization', await getTestUserAuthToken(userNumber));
    return res.text;
};

const TEST_CONSTANTS = {
    testUsers,
    getTestUserAuthToken,
    getTestUserId
};

module.exports = TEST_CONSTANTS;
