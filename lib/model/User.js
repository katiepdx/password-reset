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
  static async insert({ email, passwordHash }) {
    const { rows } = await pool.query(`
      INSERT INTO users (email, password_hash)
      VALUES ($1, $2)
      RETURNING *
    `, [email, passwordHash]);

    if (!rows[0]) return 'Sorry, unable to signup';

    return rows[0];
  }
};