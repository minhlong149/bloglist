const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'Long Nguyen',
    url: 'example.com',
    likes: 22,
  },
  {
    title: 'Browser can execute only Javascript',
    author: 'Hoang Minh',
    url: 'example.com',
    likes: 14,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  initialBlogs.forEach(async (blog) => {
    const blogObject = new Blog(blog);
    await blogObject.save();
  });
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
}, 100000);

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(initialBlogs.length);
});

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs');

  const contents = response.body.map((blog) => blog.title);
  expect(contents).toContain('Browser can execute only Javascript');
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Hoang Minh',
    url: 'example.com',
    likes: 20,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');

  const contents = response.body.map((blog) => blog.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContain('async/await simplifies making async calls');
});

test('blog without content is not added', async () => {
  const emptyBlog = {};

  await api.post('/api/blogs').send(emptyBlog).expect(400);

  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(initialBlogs.length);
});

afterAll(() => {
  mongoose.connection.close();
});
