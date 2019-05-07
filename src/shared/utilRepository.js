const _ = require('lodash')
const moment = require('moment')
moment().format()

const { knex } = require('../database')


function metadata(value, opt = false) {
  if (!opt) {
    return {
      ...value,
      created_at: moment().format(),
      created_by: 0,
    }
  }

  if (opt.create === true) {
    return {
      ...value,
      created_at: moment().format(),
      created_by: 0,
    }
  } else if (opt.update === true) {
    return {
      ...value,
      updated_at: moment().format(),
      updated_by: 0,
    }
  } else if (opt.delete === true) {
    return {
      ...value,
      deleted_at: moment().format(),
      deleted_by: 0,
    }
  }
}

async function isExists(tableName, condition) {
  const check = await knex(tableName)
    .select()
    .where(condition)

  return !_.isEmpty(check)
}

module.exports = {
  metadata,
  isExists,
}