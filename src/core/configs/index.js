const _ = require('lodash')

const { PROD_ENV, DEV_ENV, TEST_ENV } = require('./constants')
const env = _.isNil(process.env.APP_ENV) ? 'dev' : process.env.APP_ENV

const isProd = () => env === PROD_ENV
const isDev = () => env === DEV_ENV
const isTest = () => env === TEST_ENV

module.exports = {
  app: {
    port: process.env.APP_PORT,
    env,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : "secret-key",
  },
  log: {
    dir: process.env.LOG_DIR
  },
  isProd,
  isDev,
  isTest,
}