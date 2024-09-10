const bcrypt = require('bcrypt');
const db = require('../../../db/db');
const SALT_ROUNDS = 10;

async function createUser(firstName, lastName, password) {
    try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db('users').insert({
        firstname: firstName,
        lastname: lastName,
        salt: salt,
        password: hashedPassword
    }).returning('id');

    return result[0].id;
    } catch (error) {
      console.error('Error creating user:', error); // Logowanie błędu
    throw new Error('Error creating user');
    }
}

module.exports = { createUser };
