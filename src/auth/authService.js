
const authRepository = require('./authRepository')
const hash = require('./hash')
const jwt = require('./jwt')


async function register(user) {
  const password = await hash.hash(user.password)
  const input = {
    ...user,
    password,
  }

  try {
    const newUser = await authRepository.create(input)

    const token = jwt.sign({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    })

    return token
  } catch (error) {
    throw error
  }

}

async function login(username, password) {
  const user = await authRepository.findOne({ username })
  if (!user) {
    throw new Error('User Not Found')
  }

  if (!hash.verify(user.password, password)) {
    throw new Error('Wrong Password')
  }

  const token = jwt.sign({ id: user.id })

  return token
}

async function authenticating(req, res, next) {
  const bearerToken = req.get('Authorization')
  if (!bearerToken) {
    res.status(401).send({
      msg: 'Token required',
      data: bearerToken,
    })
  }
  
  let payload
  try {
    const token = bearerToken.slice(7, bearerToken.length)
    payload = jwt.verify(token)
  } catch (error) {
    res.status(401).send({
      msg: 'Token is not valid',
      data: bearerToken,
    })
  }

  const user = await authRepository.findOne({ id: payload.id })
  if (user == null) {
    return res.status(401).json({
      msg: 'User with this token was not found',
      data: bearerToken,
    })
  }

  req.user = payload
  next()
}

module.exports = {
  register,
  login,
  authenticating,
}