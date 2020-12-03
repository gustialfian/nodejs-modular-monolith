require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet')
const cors = require('cors')

const { isDev } = require('./core/configs')
const { registerRoute } = require('./router')
const { logTrafic } = require('./core/logger')

// middleware
const errorHandler = (err, req, res, next) => {
  return res.status(500).json({ msg: 'Something happend, please check your request.' })
}

function createApp()  {
  const app = express();
  app.use(helmet())
  app.use(bodyParser.json())
  app.use(cors())
  app.use(logTrafic)

  if (!isDev()) {
    app.use(errorHandler)
  }

  app.get('/', (req, res) => {
    return res.json('Safe')
  })

  registerRoute(app)

  return app
}

module.exports = {
  createApp
}