const moment = require('moment')
const { createLogger, format, transports } = require('winston')
const { combine, printf } = format
const { log: logConfigs, isTest } = require('../configs')

const myFormat = printf(info => {
  return `[${moment().format()}] ${info.level}: ${JSON.stringify(info.message)}`;
})

const logger = createLogger({
  format: combine(
    myFormat
  ),
  transports: [
    new transports.File({
      filename: `${logConfigs.dir}/error.log`,
      level: 'error'
    }),
    new transports.File({
      filename: `${logConfigs.dir}/access.log`
    }),
    new transports.Console(),
  ],
  silent: isTest()
})

const logTrafic = (req, _, next) => {
  logger.info({
    id: req.user.id,
    username: req.user.username,
    endpoint: req.originalUrl,
    method: req.method,
  });
  next();
}

module.exports = {
  logger,
  logTrafic,
}
