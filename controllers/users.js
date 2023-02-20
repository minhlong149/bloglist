const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

// Creating new users
usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;

  // store the hash of the password generated
  // with the bcrypt.hash function
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
