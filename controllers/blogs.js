const jwt = require('jsonwebtoken'); // token validator
const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes } = request.body;

  // decodes token from the authorization header
  const decodedToken = jwt.verify(request.token, process.env.SECRET_SIGNATURE);

  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(400).json('user not found');
  }

  if (!title) {
    return response.status(400).json('title missing');
  }

  if (!author) {
    return response.status(400).json('author missing');
  }

  if (!url) {
    return response.status(400).json('url missing');
  }

  const newBlog = new Blog({
    title: title,
    author: author,
    url: url,
    likes: likes || 0,
    user: user.id,
  });

  const savedBlog = await newBlog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body;

  if (!likes) {
    return response.status(400).json('likes missing');
  }

  const { id } = request.params;

  const update = {
    likes: likes,
  };

  const option = {
    new: true,
    runValidators: true,
    context: 'query',
  };

  const updatedBlog = await Blog.findByIdAndUpdate(id, update, option);
  response.json(updatedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await Blog.findByIdAndRemove(id);
  response.status(204).end();
});

module.exports = blogsRouter;
