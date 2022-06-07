const request = require('supertest');
const app = require('../app');

describe("/auth", () => {
    describe("POST /login", () => {
        // Creat a test account
        /*beforeEach(async () => {
            const response = await request(app).post("/users").send({
                email: "bob@bob.com",
                password: "BobsPassword",
                username: "bobbyboi",
                first_name: "bobby",
                last_name: "hill",
                dob: "01/01/2000",
            });
        });*/

        test("missing a request body item", async () => {
            const bodyInstances = [
                { email: "email@email.com" },
                { password: "password" },
                {}
            ];
            for(const body of bodyInstances){
                const response = await request(app).post("/auth/login").send(body);
                expect(response.statusCode).toBe(422);
            }
        });

        test("incorrect email format", async () => {
            const response = await request(app).post("/auth/login").send({
                email: "email",
                password: "password"
            });
            expect(response.statusCode).toBe(422);
            expect(response.text).toEqual("Not a valid email");
        });
    });
});