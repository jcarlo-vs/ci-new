const chai = require('chai');
const userRoutes = require('../src/routes/users');
const { setupTestApp, clearCollections, closeConnections, expect } = require('./setup');

let app;

before(async () => {
    const { app: testApp } = await setupTestApp({
        '/users': userRoutes
    });
    app = testApp;
});

beforeEach(async () => {
    await clearCollections();
});

after(async () => {
    await closeConnections();
});

describe('User Routes', () => {
    describe('POST /users', () => {
        it('should create a new user', async () => {
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                age: 25
            };

            const res = await chai.request(app)
                .post('/users')
                .send(userData);

            expect(res).to.have.status(201);
            expect(res.body).to.have.property('name', userData.name);
            expect(res.body).to.have.property('email', userData.email);
            expect(res.body).to.have.property('age', userData.age);
        });

        it('should return 400 for invalid user data', async () => {
            const invalidUserData = {
                name: 'Test User',
                email: 'invalid-email',
                age: 'not-a-number'
            };

            const res = await chai.request(app)
                .post('/users')
                .send(invalidUserData);

            expect(res).to.have.status(400);
        });
    });

    describe('GET /users', () => {
        it('should get all users', async () => {
            // First create a user
            const userData = {
                name: 'Test User',
                email: 'test@example.com',
                age: 25
            };
            await chai.request(app)
                .post('/users')
                .send(userData);

            // Then get all users
            const res = await chai.request(app).get('/users');
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('name', userData.name);
            expect(res.body[0]).to.have.property('email', userData.email);
            expect(res.body[0]).to.have.property('age', userData.age);
        });
    });
});