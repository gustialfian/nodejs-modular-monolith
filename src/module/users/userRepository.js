const { pool } = require('../../core/database')

const tbl = 'users'

async function findAll() {
  const sql = `select * from ${tbl}`
  try {
    const qr = await pool.query(sql)
    return qr.rows
  } catch (error) {
    throw error
  }
}

module.exports = {
  findAll,
}