const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

chai.use(chaiHttp);
const { expect } = chai;

let mongoServer;
let app;

const setupTestApp = async (routes) => {
  // Create an in-memory MongoDB instance if it doesn't exist
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database if not already connected
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(mongoUri);
    }
  }

  // Create Express app if it doesn't exist
  if (!app) {
    app = express();
    app.use(express.json());
  }

  // Add routes to the app
  if (routes) {
    Object.entries(routes).forEach(([path, router]) => {
      app.use(path, router);
    });
  }

  return { app, mongoServer };
};

const clearCollections = async () => {
  const collections = await mongoose.connection.db.collections();
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
};

const closeConnections = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
  app = null;
};

module.exports = {
  setupTestApp,
  clearCollections,
  closeConnections,
  expect,
};
