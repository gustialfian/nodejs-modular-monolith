const { pool } = require('../../core/database')

const tbl = 'item'

async function findAll() {
  const sql = `select * from ${tbl}`
  try {
    const qr = await pool.query(sql)
    return qr.rows
  } catch (error) {
    throw error
  }
}

async function checkCreate(lastSyncAt) {
  const sql = `select * from ${tbl} 
  where created_at > $1
    and updated_at is NULL
    and deleted_at is NULL`
  try {
    const qr = await pool.query(sql, [lastSyncAt])
    return qr.rows
  } catch (error) {
    throw error
  }
}

async function checkUpdate(lastSyncAt) {
  const sql = `select * from ${tbl} 
  where updated_at > $1
    and deleted_at is NULL`
  try {
    const qr = await pool.query(sql, [lastSyncAt])
    return qr.rows
  } catch (error) {
    throw error
  }
}

async function checkDelete(lastSyncAt) {
  const sql = `select * from ${tbl} 
  where deleted_at > $1`
  try {
    const qr = await pool.query(sql, [lastSyncAt])
    return qr.rows
  } catch (error) {
    throw error
  }
}

module.exports = {
  findAll,
  checkCreate,
  checkUpdate,
  checkDelete,
}