const moment = require('moment')
const winston = require('winston')
const { createLogger, format, transports } = winston
const { combine, printf } = format
require('winston-daily-rotate-file');
const { log: logConfigs, isTest } = require('../configs')

const myFormat = printf(info => {
  return `[${moment().format()}] ${info.level}: ${JSON.stringify(info.message)}`;
})

const winstonTransports = [new transports.Console()];

if (!isTest()) {
  const dailyTransport = new winston.transports.DailyRotateFile({
    filename: 'application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    dirname: logConfigs.dir,
  });
  
  dailyTransport.on('rotate', function(oldFilename, newFilename) {
    console.log(`daily.on(rotate): oldFilename ${oldFilename} newFilename ${newFilename}`)
  });
  winstonTransports.push(dailyTransport);
}

const logger = createLogger({
  format: combine(
    myFormat
  ),
  transports: [
    new transports.Console(),
    // dailyTransport,
    // new transports.File({
    //   filename: `${logConfigs.dir}/error.log`,
    //   level: 'error'
    // }),
    // new transports.File({
    //   filename: `${logConfigs.dir}/access.log`
    // }),
    
  ],
  silent: isTest()
})

function logTrafic(req, res, next) {
  logger.info({
    method: req.method,
    endpoint: req.originalUrl,
  });
  next();
}

module.exports = {
  logger,
  logTrafic,
}
