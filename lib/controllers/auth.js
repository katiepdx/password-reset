const { Router } = require('express');
const UserService = require('../services/UserService');
const { sendEmail } = require('../services/EmailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../model/User');

module.exports = Router()
  .post('/signup', (req, res, next) => {
    UserService
      .signup(req.body)
      // give usr a cookie
      .then(user => {
        // adds a cookie w exp date
        UserService.setSessionCookie(res, user);
        // sends user back to client with the cookie
        res.send(user);
      })
      // pass err to next middleware
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    UserService
      // check login credentials
      .authorize(req.body)
      .then(user => {
        // add cookie for user
        UserService.setSessionCookie(res, user);
        // send user back
        res.send(user);
      })
      .catch(next);
  })

  .patch('/forgot-password', async (req, res, next) => {
    // get email from incoming req
    const { email } = req.body;
    UserService
      .forgotPassword(email, res)
      .catch(next);
  })

  .patch('/reset-password/:token', (req, res, next) => {
    // get token from params
    const tempToken = req.params.token;
    const newPassword = req.body.password;
    const { email } = req.body;

    UserService
      .setNewPassword(tempToken, newPassword, email, res)
      .catch(next);
  });

