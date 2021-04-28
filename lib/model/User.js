const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  passwordHash;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.passwordHash = row.password_hash;
  }

  // add new user to database - signup 
  static async insert(email, passwordHash) {
    const { rows } = await pool.query(`
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
    `, [email, passwordHash]);

    if (!rows[0]) return null;

    return rows[0];
  }

  // login an existing user
  static async findUserByEmail(email) {
    const { rows } = await pool.query(`
    SELECT * FROM users
    WHERE email = $1
    `, [email]);

    if (!rows[0]) return null;

    return rows[0];
  }

  static async updatePassword(passwordHash, id) {
    const { rows } = await pool.query(`
    UPDATE users 
    SET password_hash = $1
    WHERE id = $2
    RETURNING *
    `, [passwordHash, id]);

    if (!rows[0]) return null;

    return rows[0];
  }
};
