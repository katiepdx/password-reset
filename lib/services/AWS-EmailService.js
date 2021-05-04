const sesClient = require('../../ses-client');

const sendSignUpConfirmation = (to) => {
  try {
    const from = process.env.AWS_FROM_EMAIL;
    const subject = 'TEST: Signup confirmation email';
    const message = 'Thanks for signing up!';
    sesClient.sendEmail(to, subject, message, from);
  } catch (err) {
    console.log('ERROR: sending email ', err);
  }
};

// sendResetEmail
const sendResetEmail = (userEmail, token) => {
  try {
    const to = userEmail;
    const from = process.env.AWS_FROM_EMAIL;
    const subject = 'Password Reset Link';
    const RESET_EMAIL_LINK = `${process.env.CLIENT_URL_PW_RESET}${token}`;
    const message =
      `Password reset link. It will expire in 10 minutes.

      ${RESET_EMAIL_LINK}`;

    sesClient.sendEmail(to, subject, message, from);
  } catch (err) {
    console.log(err);
  }

};


module.exports = {
  sendSignUpConfirmation,
  sendResetEmail
};
