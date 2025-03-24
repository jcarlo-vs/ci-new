const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

(function () {
  // Private variables and functions
  const PORT = process.env.PORT || 3000;
  const usersRouter = require('./routes/users');
  const welcomeRoutes = require('./routes/welcome');

  // Private helper functions
  const setupMiddleware = (app) => {
    app.use(express.json());
  };

  const setupRoutes = (app) => {
    app.use('/', welcomeRoutes);
    app.use('/users', usersRouter);
  };

  const startServer = (app) => {
    app.listen(PORT, () => {
      connectDB();
  
    });
  };

  // Main app setup
  const app = express();
  setupMiddleware(app);
  setupRoutes(app);

  startServer(app);
}());
