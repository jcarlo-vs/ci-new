const chai = require('chai');
const userRoutes = require('../src/routes/users');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const express = require('express');
const User = require('../src/models/User');

chai.use(chaiHttp);
const expect = chai.expect;

let app;
let mongoServer;

before(async () => {
    // Create MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Disconnect any existing connections first
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);

    app = express();
    app.use(express.json());
    app.use('/users', userRoutes);
});

beforeEach(async () => {
    // // Clear all collections
    // const collections = await mongoose.connection.db.collections();
    // for (let collection of collections) {
    //     await collection.deleteMany({});
    // }
});

after(async () => {
    // Clean up
    await mongoose.disconnect();
    await mongoServer.stop();
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
    });

    describe('GET /users', () => {
        it('should get all users', async () => {
         

          

            const res = await chai.request(app)
                .get('/users');

            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body).to.have.lengthOf(1);
            expect(res.body[0]).to.have.property('name');
            expect(res.body[0]).to.have.property('email');
            expect(res.body[0]).to.have.property('age');
        });
    });
});