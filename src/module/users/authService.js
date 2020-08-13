const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { logger } = require('../../core/logger')
const { jwt: jwtConfig } = require('../../core/configs')
const userRepo = require('./userRepository')

const namespace = 'users.authService'

async function registerUser(user) {
  try {
    const hash = bcrypt.hashSync(user.password);
    const newUser = await userRepo.insert({
      ...user,
      password: hash
    })
    return newUser
  } catch (error) {
    logger.error(`${namespace}.registerUser: ${error.message}`)
    throw error
  }
}

async function verifyUser(username, password) {
  try {
    const user = await userRepo.findByUsername(username)
    if (!user) {
      return {
        status: "ERROR",
        message: "username not found.",
      }
    }

    const match = bcrypt.compareSync(password, user.password)
    if (!match) {
      return {
        status: "ERROR",
        message: "incorrect password.",
      }
    }

    return {
      status: "OK",
      data: user,
    }

  } catch (error) {
    logger.error(`${namespace}.verifyUser: ${error.message}`)
    throw error
  }
}

function generateJWT(user) {
  const payload = {
    username: user.username,
    role: user.role,
  }
  var token = jwt.sign(payload, jwtConfig.secret);
  return {
    status: "OK",
    data: token,
  }
}

module.exports = {
  registerUser,
  verifyUser,
  generateJWT,
}