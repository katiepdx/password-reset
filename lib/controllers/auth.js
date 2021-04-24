const { Router } = require('express');
const UserService = require('../services/UserService');

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
      });
  });
