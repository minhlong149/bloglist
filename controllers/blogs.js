const blogsRouter = require('express').Router();

blogsRouter.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = blogsRouter;
