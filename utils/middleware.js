const logger = require('./logger');

// Prints information about every request that is sent to the server
const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method);
  logger.info('Path:  ', request.path);
  logger.info('Body:  ', request.body);
  logger.info('---');

  next(); // yields control to the next middleware.
};

// Catching requests made to non-existent routes.
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// If the next function is called with an error parameter,
// the execution will continue to the error handler middleware.

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);
  switch (error.name) {
    // invalid object id for Mongo.
    case 'CastError':
      return response.status(400).send({ error: 'malformatted id' });

    // store an object in the database that breaks one of the constraints
    case 'ValidationError':
      return response.status(400).json({ error: error.message });

    // token is missing or is it invalid
    case 'JsonWebTokenError':
      return response.status(400).json({ error: error.message });

    // expired token
    case 'TokenExpiredError':
      return response.status(401).json({
        error: 'token expired',
      });
  }

  next(error); // Passes the error forward to the default Express error handler
};

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request);
  next();
};

const getTokenFrom = (request) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
};
