const bcrypt = require('bcrypt');
const supertest = require('supertest');

const User = require('../models/user');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'minhlong149',
      name: 'Long Nguyen',
      password: 'sX@A88&Ve7$N',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  // test('creation fails with proper statuscode and message if username already taken', async () => {
  //   const usersAtStart = await helper.usersInDb();

  //   // The beforeEach block adds a user with the username root to the database.
  //   const newUser = {
  //     username: 'root',
  //     name: 'Super User',
  //     password: 'cV58^CkWk#4p',
  //   };

  //   const result = await api
  //     .post('/api/users')
  //     .send(newUser)
  //     .expect(400)
  //     .expect('Content-Type', /application\/json/);

  //   expect(result.body.error).toContain('expected `username` to be unique');

  //   const usersAtEnd = await helper.usersInDb();
  //   expect(usersAtEnd).toEqual(usersAtStart);
  // });
});
