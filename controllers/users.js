const bcrypt = require('bcrypt'); // generate the password hashes
const usersRouter = require('express').Router();
const User = require('../models/user');

// Creating new users
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  if (!username) {
    return response.status(400).json('username not found');
  }

  if (!password) {
    return response.status(400).json('password not found');
  }

  if (username.length < 3) {
    return response
      .status(400)
      .json('username must be at least 3 characters long');
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json('password must be at least 3 characters long');
  }

  const duplicatedUser = await User.findOne({
    username: new RegExp(username, 'i'),
  });
  if (duplicatedUser) {
    return response.status(400).json('username must be unique');
  }

  // Generate the password hash using the bcrypt library
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

// returns all of the users in the database
usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    user: 0,
  });
  response.json(users);
});

module.exports = usersRouter;
