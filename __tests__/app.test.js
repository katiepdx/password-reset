const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

// mock sendgrid email service
jest.mock('../lib/services/EmailService.js');
const EmailService = require('../lib/services/EmailService');

describe('sign up and login routes', () => {
  beforeEach(() => {
    // drop db
    return setup(pool)
      // add a user to db
      .then(() => {
        UserService.signup({
          email: process.env.TEST_USER_EMAIL_1,
          password: 'test-email-1-pw'
        });
      });
  });

  it('adds a user to to the database with an email and hashed password and sends a confirmation email', () => {
    return request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: process.env.TEST_USER_EMAIL_2,
        password: 'test-email-2-pw'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: '2',
          email: process.env.TEST_USER_EMAIL_2
        });
        expect(EmailService.sendSignUpConfirmation).toHaveBeenCalledTimes(1);
      });
  });

  it('logins a user1', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: process.env.TEST_USER_EMAIL_1,
        password: 'test-email-1-pw'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: '1',
          email: process.env.TEST_USER_EMAIL_1,
        });
      });
  });

  it('tests a failed login attempt by user1 with incorrect password', () => {
    return request(app)
      .post('/api/v1/auth/login')
      .send({
        email: process.env.TEST_USER_EMAIL_1,
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
        // email 2 as wrong email
        email: process.env.TEST_USER_EMAIL_2,
        password: 'test-email-1-pw'
      })
      .then(res => {
        expect(res.text).toEqual('Sorry, incorrect email/password');
      });
  });
});

describe('password reset tests', () => {
  it('tests that a user is sent a password reset link and given a 200 status code', () => {
    return request(app)
      .patch('/api/v1/auth/forgot-password')
      .send({
        email: process.env.TEST_USER_EMAIL_1,
      })
      .then((res) => {
        expect(res.body.message).toEqual('Please check your email for a reset link!');
        expect(res.status).toEqual(200);
        expect(EmailService.sendResetEmail).toHaveBeenCalledTimes(1);
      });
  });

  it('tests that an error is given if the token is incorrect', () => {
    return request(app)
      .patch('/api/v1/auth/reset-password/s8ds32jif8s')
      .send({
        email: process.env.TEST_USER_EMAIL_1,
        password: 'newestpassword'
      })
      .then((res) => {
        expect(res.body.message).toEqual('Sorry, please try again. Token may have expired or is incorrect');
      });
  });
});
