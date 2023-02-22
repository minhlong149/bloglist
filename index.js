const http = require('http'); // Node's built-in web server module
const app = require('./app'); // actual Express app
const config = require('./utils/config');
const logger = require('./utils/logger');

// create a web server separate from the Express app
const server = http.createServer(app);

const PORT = config.PORT || 3001;
server.listen(PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
