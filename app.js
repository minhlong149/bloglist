const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Allow for requests from all other origins
require('express-async-errors'); // Eliminate catching exceptions for route handlers
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const config = require('./utils/config');

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connection to MongoDB:', error.message);
  });

const app = express();

// Allow for requests from all other origins
app.use(cors());

// handler to access data from the body property of HTTP POST requests
app.use(express.json());

// The json-parser functions takes the JSON data of a request, transforms it into a JavaScript object
// and then attaches it to the body property of the request object before the route handler is called.

app.use(middleware.requestLogger);
app.use(middleware.tokenExtractor);

// Middleware functions have to be taken into use before routes
// so that it can be executed before the route event handlers are called.

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

// Middleware functions define after routes
// only called if no route handles the HTTP request.

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint);

// handler of requests with result to errors has to be the last loaded middleware
app.use(middleware.errorHandler);

module.exports = app;
