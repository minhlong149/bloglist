const express = require('express');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const config = require('./utils/config');

const mongoose = require('mongoose');

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

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.use('/api/blogs', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
