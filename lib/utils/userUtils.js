// jsonwebtoken for cookie
const jwt = require('jsonwebtoken');
// bcrypt for hashing the password 
const bcrypt = require('bcryptjs');

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

const setTemporaryToken = async (user) => {
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

const verifyTempToken = (tempToken) => {
  jwt.verify(tempToken, process.env.RESET_SECRET, (error) => {
    if (error) throw new Error('Sorry, please try again. Token may have expired or is incorrect');
  });
};

const hashPassword = (password, saltRounds) => {
  const hashedPassword = bcrypt.hash(password, Number(saltRounds));
  return hashedPassword;
};

// bcrypt compare incoming pw with pw hash from db
const comparePasswords = (password, hashedPassword) => (bcrypt.compare(password, hashedPassword));

module.exports = {
  getJWT,
  setTemporaryToken,
  verifyTempToken,
  hashPassword,
  comparePasswords
};
