const express = require('express');
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;
