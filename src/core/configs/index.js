const { PROD_ENV, DEV_ENV, TEST_ENV } = require('./constants')
const env = process.env.APP_ENV ? process.env.APP_ENV : DEV_ENV

module.exports = {
  app: {
    env,
    port: process.env.APP_PORT,
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
  isProd: () => env === PROD_ENV,
  isDev: () => env === DEV_ENV,
  isTest: () => env === TEST_ENV,
}