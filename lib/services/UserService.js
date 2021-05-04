// signup/login/reset password utils
const {
  getJWT,
  setTemporarySessionCookie,
  verifyTempToken,
  hashPassword,
  comparePasswords
} = require('../utils/userUtils');
// User model for adding user to db
const User = require('../model/User');
// const SGEmailService = require('./SG-EmailService');
const AWSEmailService = require('./AWS-EmailService');

const ONE_DAY = 1000 * 60 * 60 * 24;

// destructure email and password off the incoming request 
const signup = async ({ email, password }) => {
  // hash incoming password
  return hashPassword(password, Number(process.env.SALT_ROUNDS))
    // add user to db with hashedPassword
    .then((hashedPassword) => User.insert(email, hashedPassword));
};

// login a user 
const authorize = async ({ email, password }) => {
  // find user in db 
  const user = await User.findUserByEmail(email);
  // if there's no user
  if (!user) return ('Sorry, incorrect email/password');

  // verify users password
  const validPassword = await comparePasswords(password, user.passwordHash);

  // invalid pw scenario
  if (!validPassword) return ('Sorry, incorrect email/password');

  // return user if pw is a match but without the passwordHash attached
  return user.toJSON();
};

const setSessionCookie = async (res, user) => {
  // get JWT for the user
  const token = getJWT(user);

  // cookie name is 'session'
  res.cookie('session', token, {
    maxAge: ONE_DAY,
    sameSite: 'lax',
    httpOnly: true
  });
};

const forgotPassword = async (email) => {
  // get user from db by email
  const user = await User.findUserByEmail(email);
  if (!user) throw new Error('Sorry, could not find that email');

  const tempToken = await setTemporarySessionCookie(user);

  // send email to the user
  // SGEmailService.sendResetEmail(user.email, tempToken);
  AWSEmailService.sendResetEmail(user.email, tempToken);
};

const setNewPassword = async (tempToken, newPassword, email) => {
  // check temp token
  verifyTempToken(tempToken);

  // find user in db using the stored token from earlier
  const user = await User.findUserByEmail(email);

  // if no user
  if (!user) throw new Error('Sorry, we could not find a match for this link');

  // hash password again
  const hashedPassword = await hashPassword(newPassword, process.env.SALT_ROUNDS);

  // update user password in db with the new hashed pw
  await User.updatePassword(hashedPassword, user.id);
};

module.exports = {
  signup,
  setSessionCookie,
  authorize,
  forgotPassword,
  setNewPassword
};
