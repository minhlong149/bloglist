const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const { initialBlogs, blogsInDb } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const contents = response.body.map((blog) => blog.title);
    expect(contents).toContain('Browser can execute only Javascript');
  });

  describe('addition of a new blog', () => {
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

      const blogsAtEnd = await blogsInDb();

      const contents = blogsAtEnd.map((blog) => blog.title);

      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);

      expect(contents).toContain('async/await simplifies making async calls');
    });

    test('blog without content is not added', async () => {
      const emptyBlog = {};

      await api.post('/api/blogs').send(emptyBlog).expect(400);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd).toHaveLength(initialBlogs.length);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await blogsInDb();

      expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);

      const contents = blogsAtEnd.map((blog) => blog.title);

      expect(contents).not.toContain(blogToDelete.title);
    });
  });

  test('update blog like', async () => {
    const blogsAtStart = await blogsInDb();
    const blogToUpdate = blogsAtStart[0];

    const likesUpdated = blogToUpdate.likes + 1;

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({
        likes: likesUpdated,
      })
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await blogsInDb();
    const updatedBlog = blogsAtEnd[0];

    expect(updatedBlog.likes).toBe(likesUpdated);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
