const { Pool } = require('pg')

const { logger } = require('../logger')
const {
  db: {
    host,
    port,
    user,
    password,
    database,
    connectionTimeoutMillis
  }
} = require('../configs')

const pool = new Pool({
  user,
  host,
  database,
  password,
  port,
  connectionTimeoutMillis
})

pool.query('SELECT NOW()')
  .then(res => {
    logger.info(`db connected`)
  })
  .catch(err => {
    logger.error(err.message)
    cleanUp()
    process.exit(1)
  })

const cleanUp = () => {
  pool.end(() => {
    logger.info('pool has ended')
  })
}

module.exports = {
  pool,
  cleanUp,
}