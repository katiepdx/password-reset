const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

describe('password-reset routes', () => {
  beforeEach(() => {
    return setup(pool)
      // add a user to db
      .then(() => {
        UserService.signup({
          email: 'user1@user1.com',
          password: 'user1password'
        });
      });
  });

  it('adds a user to to the database with an email and hashed password', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'user2@user2.com',
        password: 'user1password'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: '2',
          email: 'user2@user2.com',
          password_hash: expect.any(String)
        });
      });
  });

  it('logins a user1', () => {
    return request(app)
      .post('/api/v1/auth/login')
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

  it('tests a failed login attempt by user1 with incorrect password', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user1@user1.com',
        password: 'wrong password'
      })
      .then(res => {
        expect(res.text).toEqual('Sorry, incorrect email/password');
      });
  });

  it('tests a failed login attempt by user1 with incorrect password', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user1@user1.com',
        password: 'wrong password'
      })
      .then(res => {
        expect(res.text).toEqual('Sorry, incorrect email/password');
      });
  });

  it('tests a failed login attempt by user1 with incorrect email', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'user2@user1.com',
        password: 'user1password'
      })
      .then(res => {
        expect(res.text).toEqual('Sorry, incorrect email/password');
      });
  });
});
