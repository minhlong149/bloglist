const express = require('express');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use(middleware.requestLogger);

app.use('/api/notes', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
