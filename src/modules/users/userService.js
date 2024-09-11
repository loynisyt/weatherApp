const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const db = require('../../../db/db');
const SALT_ROUNDS = 10;

async function createUser(firstName, lastName, login, password) {
  try {
      const salt = await bcrypt.genSalt(SALT_ROUNDS);
      const hashedPassword = await bcrypt.hash(password, salt);

      const result = await db('users').insert({
          id: uuidv4(), 
          firstname: firstName,
          lastname: lastName,
          login: login,
          salt: salt,
          password: hashedPassword,
          created_at: new Date(),
          updated_at: new Date()  
      }).returning('id');

      return result[0].id;
  } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Error creating user');
  }
}


async function loginUser(login, password){
  try {
      const user = await db('users').where({ login }).first();
      if (!user) {
          throw new Error('Invalid login or password');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          throw new Error('Invalid login or password');
      }
      const token = await createSession(user.id);

      return token; 
  } catch (error) {
      console.error('Error during login:', error);
      throw new Error('Error during login');
  }
}



async function createSession(userId) {
  try {
    const token = uuidv4(); 
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    const [sessionId] = await db('sessions').insert({
      user_id: userId,
      token: token,
      expires_at: expiresAt
    }).returning('id');

    return token; 
  } catch (error) {
    console.error('Error creating session:', error);
    throw new Error('Error creating session');
  }
}


module.exports = { createUser, loginUser, createSession,};
