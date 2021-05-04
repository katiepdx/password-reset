// sendGrid to send password reset link to user
const sgMail = require('@sendgrid/mail');

const sendSignUpConfirmation = (userEmail) => {
  // sendGrid api key check
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  // email message details - obj
  const confirmationMessage = {
    to: userEmail,
    from: process.env.SENDGRID_SEND_EMAIL,
    subject: 'Sign up notification',
    html: `
    <h1>Thanks for signing up!</h1>
    <p>Welcome! The email ${userEmail} was used to sign up for APP NAME. If you did not sign up or wish to unsubscribe/delete your information, please contact CONTACT EMAIL HERE and we will help you. </p>
    `
  };

  // send confirmation upon successful signup
  sgMail.send(confirmationMessage)
    .then(() => console.log('Signup confirmation email sent!'))
    .catch((err) => console.error(err));
};

const sendResetEmail = (userEmail, token) => {
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
    .then(() => console.log('Password reset email sent!'))
    .catch((err) => console.error(err));
};

module.exports = {
  sendSignUpConfirmation,
  sendResetEmail
};
