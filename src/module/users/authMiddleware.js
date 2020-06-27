const jwt = require('jsonwebtoken')
const { logger } = require('../../core/logger')
const config = require('../../core/configs')

function authenticate(roleGranted = []) {
  return function (req, res, next) {
    const authorizationHeader = req.header("Authorization")

    if (!authorizationHeader) {
      return res.status(401).json({
        msg: "No token, authorization denied"
      })
    }

    const token = authorizationHeader.slice(7, authorizationHeader.length)

    try {
      const decoded = jwt.verify(token, config.jwt.secret)

      if (!roleGranted.includes(decoded.role)) {
        return res.status(401).json({
          msg: "Your role can not access this endpoint, authorization denied"
        })
      }

      req.user = decoded

      next();
    } catch (error) {
      logger.error(`auth.middleware.authenticate: ${error.message}`)
      res.status(401).json({
        msg: "Token is not valid"
      })
    }

  }
}

module.exports = { authenticate }
