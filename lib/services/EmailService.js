// sendGrid to send password reset link to user
const sgMail = require('@sendgrid/mail');
// User model for insert user
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const UserService = require('./UserService');

const sendEmail = (userEmail, token) => {
  console.log(userEmail, 'SEND EMAIL USER EMAIL');
  // sendGrid api key check
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const RESET_EMAIL_LINK = `${process.env.CLIENT_URL_PW_RESET}${token}`;

  // email message details - obj
  const resetMessage = {
    to: userEmail,
    from: process.env.SENDGRID_SEND_EMAIL,
    subject: 'Password Reset Link',
    html: `
    <h1>Password Reset Link</h1>
    <p>It will expire in 10 minutes</p>
    <a href="${RESET_EMAIL_LINK}">
    ${RESET_EMAIL_LINK}
    </a>
    `
  };

  // send email with above msg details
  sgMail.send(resetMessage)
    .then(() => console.log('Email sent!'))
    .catch((err) => console.error(err));
};

module.exports = { sendEmail };
