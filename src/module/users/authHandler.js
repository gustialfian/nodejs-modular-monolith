const router = require('express').Router()
const { logger } = require('../../core/logger')
const authService = require('./authService')

const namespace = 'users.authHandler'

router.post('/register', async (req, res) => {
  try {
    const user = {
      username: req.body.username,
      password: req.body.password,
      role: req.body.role,
    }
    const data = await authService.registerUser(user)
    return res.json({ 
      status: "SUCCESS",
      data,
    })
  } catch (error) {
    logger.error(`${namespace}.post.register: ${error.message}`)
    return res.status(500).json({status: "INTERNAL_SERVER_ERROR"})
  }
})

router.post('/sign-in', async (req, res) => {
  try {
    console.log(req.body)
    const username = req.body.username
    const password = req.body.password

    const verified = await authService.verifyUser(username, password)
    if (verified.status === 'ERROR') {
      return res.json({
        status: "ERROR",
        message: verified.message,
      })
    }

    const token = authService.generateJWT(verified.data)

    return res.json({ 
      status: "SUCCESS",
      data: `Bearer ${token.data}`,
    })
  } catch (error) {
    logger.error(`${namespace}.post.sign-in: ${error.message}`)
    return res.status(500).json({status: "INTERNAL_SERVER_ERROR"})
  }
})

module.exports = router