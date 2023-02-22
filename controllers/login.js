const jwt = require('jsonwebtoken'); // generate JSON web tokens
const bcrypt = require('bcrypt'); // check if the password is correct
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  const unauthorized = !(user && passwordCorrect);
  if (unauthorized) {
    return response.status(401).json({
      error: 'invalid username or password',
    });
  }

  // A token is created if the password is correct
  const userForToken = {
    username: user.username,
    id: user._id,
  };

  // sign the token from the secret
  const secondPerHour = 60 * 60;
  const token = jwt.sign(userForToken, process.env.SECRET_SIGNATURE, {
    // limit the validity period of a token
    expiresIn: secondPerHour,
  });

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});

module.exports = loginRouter;
