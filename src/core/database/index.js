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

 // TODO something wrong with the pool. It's way to slow connecting and insert operations not working at all

pool.query('SELECT NOW()', (err, res) => {
  logger.info(`db connected`)
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