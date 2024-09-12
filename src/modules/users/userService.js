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
async function updateUser(id, firstName, lastName, login) {
  try {
      await db('users').where({ id }).update({
          firstname: firstName,
          lastname: lastName,
          login: login,
          updated_at: new Date()
      });
  } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Error updating user');
  }
}

async function deleteUser(id) {
  try {
      await db('users').where({ id }).del();
  } catch (error) {
      console.error('Error deleting user:', error);
      throw new Error('Error deleting user');
  }
}


async function isAuthorizedMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const session = await db('sessions').where({ token }).first();

    if (!session) {
      return res.status(401).json({ message: 'Token is invalid' });
    }
    const now = new Date();
    if (now > session.expires_at) {
      return res.status(401).json({ message: 'Token has expired' });
    }

      req.userId = session.user_id;
      next();

  } catch (error) {
    console.error('Error validating token:', error);
    return res.status(500).json({ message: 'Error validating token' });
  }
}

module.exports = { createUser, loginUser, createSession, updateUser, deleteUser, isAuthorizedMiddleware};
