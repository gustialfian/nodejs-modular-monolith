require('dotenv').config()
const http = require('http')

const { app: appConfigs } = require('./core/configs')
const { logger } = require('./core/logger')
const { registerTerminus } = require('./core/terminus')
const { createApp } = require('./server')

const app = createApp()
const server = http.createServer(app)
registerTerminus(server)

server.listen(appConfigs.port, () => {
  logger.info('Server up...')
  logger.info(`http://localhost:${appConfigs.port}/`)
})