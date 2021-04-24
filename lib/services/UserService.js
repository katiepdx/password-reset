// bcrypt for hashing the password 
const bcrypt = require('bcryptjs');
// jsonwebtoken for cookie
const jwt = require('jsonwebtoken');
// User model for adding user to db
const User = require('../model/User');

const ONE_DAY = 1000 * 60 * 60 * 24;

// destructure email and password off the incoming request 
const signup = async ({ email, password }) => {
  // hash password with bcrypt - (password to be hashed and salt rounds)
  const passwordHash = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

  // use model and insert user to db with hashed pw 
  const addedUser = await User.insert({ email, passwordHash });

  return addedUser;
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

module.exports = {
  signup,
  getJWT,
  setSessionCookie
};
