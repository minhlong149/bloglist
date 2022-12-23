const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const newBlog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes,
  });

  const savedBlog = await newBlog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
