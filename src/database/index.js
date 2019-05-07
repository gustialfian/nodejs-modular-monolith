const { logger } = require('../logger')
const {
  db: {
    host,
    port,
    user,
    password,
    database,
  }
} = require('../configs')

var knex = require('knex')({
  client: 'pg',
  connection: {
    host,
    port,
    user,
    password,
    database,
  },
});

knex.raw('select 1+1 as result').then(_ => {
  logger.info(`db connected`)
}).catch(_ => {
  logger.info(`db connection error`)
})

module.exports = {
  knex,
}