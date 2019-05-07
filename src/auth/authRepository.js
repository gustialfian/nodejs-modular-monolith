const { knex } = require('../database')
const { metadata, isExists } = require('../shared/utilRepository')

const table = 'users'

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
  const check = await isExists(table, { username: user.username })
  if (check) {
    throw new Error('Username sudah digunakan')
  }
  
  try {
    const input = metadata(user)
    const data = await knex(table)
      .returning(['id', 'username', 'role'])
      .insert(input)

    return data
  } catch (error) {
    throw error
  }
}

module.exports = {
  findOne,
  create,
}