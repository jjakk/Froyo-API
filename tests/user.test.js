const request = require('supertest');
const app = require('../app');

const DUMMY_FORM_DATA = {
    email: "email@email.com",
    username: "randomUsername",
    dob: new Date("November 23, 1995"),
    first_name: "randomFirstName",
    last_name: "randomLastName",
    password: "randomPassword",
};

describe("/users", () => {
    describe("POST /user", () => {
        test("empty request body", async () => {
            const response = await request(app).post("/users").send({});
            expect(response.statusCode).toBe(422);
        });

        test("missing a request body item", async () => {
            const bodyInstances = [
                { ...DUMMY_FORM_DATA, email: null },
                { ...DUMMY_FORM_DATA, username: null },
                { ...DUMMY_FORM_DATA, dob: null },
                { ...DUMMY_FORM_DATA, first_name: null },
                { ...DUMMY_FORM_DATA, last_name: null },
                { ...DUMMY_FORM_DATA, email: null },
            ];
            for(const body of bodyInstances){
                const response = await request(app).post("/users").send(body);
                expect(response.statusCode).toBe(422);
            }
        });

        /*test("valid request body", async () => {
            const body = DUMMY_FORM_DATA;
            const response = await request(app).post("/users").send(body);
            console.log(response.text);
            expect(response.statusCode).toBe(200);
        });*/
    });
});