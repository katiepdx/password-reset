// bcrypt for hashing the password 
const bcrypt = require('bcryptjs');
// jsonwebtoken for cookie
const jwt = require('jsonwebtoken');
// User model for adding user to db
const User = require('../model/User');
const EmailService = require('../services/EmailService');

const ONE_DAY = 1000 * 60 * 60 * 24;

// destructure email and password off the incoming request 
const signup = async ({ email, password }) => {
  // hash password with bcrypt - (password to be hashed and salt rounds)
  const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  // use model and insert user to db with hashed pw 
  const addedUser = await User.insert({ email, passwordHash });

  return addedUser;
};

// login a user 
const authorize = async ({ email, password }) => {
  // find user in db 
  const user = await User.findUserByEmail(email);

  // if there's no user
  if (!user) return ('Sorry, incorrect email/password');

  // verify users password - bcrypt compare incoming pw with pw hash from db
  const validPassword = await bcrypt.compare(password, user.password_hash);

  // invalid pw scenario
  if (!validPassword) return ('Sorry, incorrect email/password');

  // return user if pw is a match
  return user;
};

const getJWT = (user) => {
  // create token for user - signed by this app
  const token = jwt.sign(
    // payload of the user
    { payload: user },
    // app secret - unique to this app
    process.env.JWT_APP_SECRET,
    // expiry date - 24hrs from now
    { expiresIn: '24h' }
  );

  // return token - to be used for setting session cookie
  return token;
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

const setTemporarySessionCookie = async (user) => {
  const tempToken = jwt.sign(
    // payload of email
    { payload: user.email },
    // special reset secret 
    process.env.RESET_SECRET,
    // expires in shorter amt of time
    { expiresIn: '10m' }
  );
  return tempToken;
};

const forgotPassword = async (email) => {
  // get user from db by email
  const user = await User.findUserByEmail(email);
  if (!user) throw new Error('Sorry, could not find that email');

  const tempToken = await setTemporarySessionCookie(user);

  // send email to the user
  EmailService.sendEmail(user.email, tempToken);
};

const setNewPassword = async (tempToken, newPassword, email) => {
  // check token
  jwt.verify(tempToken, process.env.RESET_SECRET, (error) => {
    if (error) throw new Error('Sorry, please try again. Token may have expired or is incorrect');
  });

  // find user in db using the stored token from earlier
  const user = await User.findUserByEmail(email);

  // if no user
  if (!user) throw new Error('Sorry, we could not find a match for this link');

  // hash password again
  const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));

  // update user password in db with the new hashed pw
  await User.updatePassword(hashedPassword, user.id);
};

module.exports = {
  signup,
  getJWT,
  setSessionCookie,
  authorize,
  setTemporarySessionCookie,
  forgotPassword,
  setNewPassword
};
