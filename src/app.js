require('dotenv').config()
const { createApp } = require('./server')
const { logger } = require('./logger')

const app = createApp()
app.listen(process.env.APP_PORT, () => {
  logger.info('Server up...')
  logger.info(`http://localhost:${process.env.APP_PORT}/`)
})