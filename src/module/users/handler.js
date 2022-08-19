const router = require('express').Router()
const { logger } = require('../../core/logger')
const userRepo = require('./userRepository')

const namespace = 'users.handler'

router.get('/', async (req, res) => {
  try {
    const data = await userRepo.findAll() // TODO: use pagination

    return res.json(data)
  } catch (error) {
    logger.error(`${namespace}.get./`)
  }
})

router.get('/:id', async (req, res) => {
  try {
    const data = await userRepo.getById((req.params.id))

    return res.json(data);
  } catch (error) {
    logger.error(`${namespace}.get.id`)

    res.status(500)
    res.json({ error: error.message })
  }

  return res.json(`GET ID: Users ${req.params.id}`)
})

router.post('/', async (req, res) => {
  return res.json("POST: Users")
})

router.put('/:id', async (req, res) => {
  return res.json("GET: Users")
})

router.delete('/:id', async (req, res) => {
  return res.json("GET: Users")
})

module.exports = router