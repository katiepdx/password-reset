const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

describe('password-reset routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('adds a user to to the database with an email and hashed password', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'user1@user1.com',
        password: 'user1password'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: '1',
          email: 'user1@user1.com',
          password_hash: expect.any(String)
        });
      });
  });
});
