const Blog = require('../models/blog');
const User = require('../models/user');

const sampleBlogOne = {
  title: 'HTML is easy',
  author: 'Long Nguyen',
  url: 'example.com',
  likes: 22,
};

const sampleBlogTwo = {
  title: 'Browser can execute only Javascript',
  author: 'Hoang Minh',
  url: 'example.com',
  likes: 14,
};

const initialBlogs = [sampleBlogOne, sampleBlogTwo];

const nonExistingId = async () => {
  // creating a database object ID
  // that does not belong to any note object in the database
  const newBlog = new Blog(sampleBlogOne);
  await newBlog.save();
  await newBlog.remove();

  return newBlog._id.toString();
};

const blogsInDb = async () => {
  // checking the blogs stored in the database
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
};
