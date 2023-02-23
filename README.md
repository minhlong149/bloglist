# Blog List Application

A blog list RESTful web service utilizing Node.js & MongoDB to save information about interesting blogs users have stumbled across on the internet, featuring JSON Web Token for user authentication.

This is part of the [full stack course by University of Helsinki](https://fullstackopen.com/en/part4)

## Table of Contents

- [Blog List Application](#blog-list-application)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
    - [Features](#features)
    - [Links](#links)
  - [Getting started](#getting-started)
    - [Installation](#installation)
    - [Project structure](#project-structure)
    - [Deployment](#deployment)
    - [Running Tests](#running-tests)
  - [Authors](#authors)

## Overview

### Features

- Implemented & Deployed a RESTful HTTP APIs with MongoDB Atlas as a database service.
- **Structured project directory**: Separate different responsibilities of the application into separate modules, make developing the application much easier.
- **Conducted integration testing**: Test the entire application through its REST API, included the database.
- **Token authentication**: Server generates a token to identify the logged-in user. `bcrypt` is used to hash the user's password.

### Links

- View code solution: <https://github.com/minhlong149/bloglist>
- Live API preview: <https://longdm-bloglist.cyclic.app>

## Getting started

### Installation

Clone this repo, then install the `npm` packages. [Node.js](https://nodejs.org/en/) must be installed.

```bash
git clone https://github.com/minhlong149/bloglist
cd bloglist
npm install
```

To run this project, you will need to add the following environment variables to your `.env` file: `PORT`, `MONGODB_URI`, `TEST_MONGODB_URI`, `SECRET_SIGNATURE`

### Project structure

```
├── index.js
├── app.js
├── controllers
│   └── blogs.js
│   └── ...
├── models
│   └── blog.js
│   └── ...
├── package-lock.json
├── package.json
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js
```

- The `index.js` file only imports the actual application from the `app.js` file and then starts the application.
- The responsibility of establishing the connection to the database is given to the `app.js` module. Files under the `models` directory defines the Mongoose schemas.
- All printing to the console are separated to its own module `utils/logger.js`.
- The handling of environment variables is extracted into a separate `utils/config.js` file
- Custom middlewares are moved to `utils/middleware.js` module

### Deployment

- Run `npm start` and open the application in the browser by visiting the address <http://localhost:3001>

- Start the server in development mode with `nodemon` via the command `npm run dev`. Changes to the application code will cause the server to restart automatically.

> If port 3001 is already in use by some other application, either shut down the application using port 3001, or use a different port for this application.

### Running Tests

> **_THE TESTS HAS BEEN BROKE DOWN AFTER ADDING TOKEN-BASED AUTHENTICATION_**

The entire application is tested through its REST API, included the database. Modes are also separated for testing via the `NODE_ENV` environment variable.

To executes all of the tests for the application, run the following command:

```bash
npm run test
```

You can also specify the tests that need to be run as parameters of the `npm` test command.

> Most Windows command prompts will choke when you set environment variables with `NODE_ENV=test`. We can correct this by installing the `cross-env` package as a development dependency and use it in our `npm` scripts defined in `package.json`. _If you are deploying this application to Fly.io/Render, save `cross-env` to a production dependency._

```bash
cross-env NODE_ENV=test jest --verbose --runInBand --detectOpenHandles
```

## Authors

- [@minhlong149](https://www.github.com/minhlong149)
