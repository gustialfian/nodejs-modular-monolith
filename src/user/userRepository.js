const { knex } = require('../database')
const { metadata, isExists } = require('../shared/utilRepository')

const table = 'users'

async function findAll() {
  try {
    const data = await knex(table).select('*')

    return data
  } catch (error) {
    return false
  }
}

async function findOne(condition) {
  try {
    const data = await knex(table)
      .select('*')
      .where(condition)

    return data[0]
  } catch (error) {
    return false
  }
}

async function create(user) {
  try {
    const input = metadata(user)
    const data = await knex(table)
      .returning(['id', 'username'])
      .insert(input)

    return data
  } catch (error) {
    return false
  }
}

async function update(id, user) {
  try {
    const condition = { 'id': id }
    
    if (!isExists(table, condition)) {
      return 'not found'
    }

    const data = await knex(table)
      .returning(['id', 'username'])
      .where(condition)
      .update(user)

    return data
  } catch (error) {
    return false
  }
}

async function destroy(id) {
  try {
    const condition = { 'id': id }

    if (!isExists(table, condition)) {
      return 'not found'
    }

    const data = await knex(table)
      .returning(['id', 'username'])
      .where(condition)
      .delete()

    return data
  } catch (error) {
    return false
  }
}

module.exports = {
  findAll,
  findOne,
  create,
  update,
  destroy,
}