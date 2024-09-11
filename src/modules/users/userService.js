const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const db = require('../../../db/db');
const SALT_ROUNDS = 10;

async function createUser(firstName, lastName, login, password) {
    try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await db('users').insert({
        firstname: firstName,
        lastname: lastName,
        login: login,
        salt: salt,
        password: hashedPassword
    }).returning('id');

    return result[0].id;
    } catch (error) {
      console.error('Error creating user:', error); 
    throw new Error('Error creating user');
    }
}


async function loginUser(login, password) {
  try {
    const user = await db('users').where({ login }).first();
    if (!user) {
      throw new Error('Invalid login or password');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid login or password');
    }
    return {
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
    };
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Error during login');
  }
}

async function createToken(login, password) {
  try {
    const user = await db('users').where({ login }).first();
    if (!user) {
      throw new Error('Invalid login or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid login or password');
    }
    const tokenValue = crypto.randomBytes(4).toString('hex');
    const tokenId = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const result = await db('tokens').insert({
      id: tokenId,
      token: tokenValue,
      user_id: user.id,
      expires_at: expiresAt
    });

    return {
      token: tokenValue,
      expiresAt
    };
  } catch (error) {
    console.error('Error during token creation:', error);
    throw new Error('Error during token creation');
  }
}

async function loginWithToken(token) {
  try {
    const tokenRecord = await db('tokens').where({ token }).first();
    if (!tokenRecord) {
      throw new Error('Invalid token');
    }
    const now = new Date();
    if (now > tokenRecord.expires_at) {
      throw new Error('Token has expired');
    }
    const user = await db('users').where({ id: tokenRecord.user_id }).first();
    return {
      id: user.id,
      firstName: user.firstname,
      lastName: user.lastname,
    };
  } catch (error) {
    console.error('Error during login with token:', error);
    throw new Error('Invalid or expired token');
  }
}




module.exports = { createUser, loginUser, createToken,loginWithToken };
