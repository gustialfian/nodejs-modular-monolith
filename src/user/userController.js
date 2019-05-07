const router = require('express').Router()
const { body } = require('express-validator/check')

const { authenticating } = require('../auth/authService')
const { validate } = require('../shared/validator')
const UserRepository = require('./userRepository')

router.use(authenticating)

router.get('/', async (req, res) => {
  const data = await UserRepository.findAll()
  return res.json({ data })
})

router.get('/:id', async (req, res) => {
  const data = await UserRepository.findOne({ id: req.params.id })
  if (!data) {
    return res.json({ data, msg: 'data tidak ditemukan' })
  }
  return res.json({ data, msg: 'data berdasarkan id' })
})

router.put('/:id', [
  body('username').isAlphanumeric().withMessage(`username required`),
  body('password').isAlphanumeric().withMessage(`password required`),
  body('role').isAlpha().withMessage(`role required/alpha`),
  validate,
], async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  }
  const data = await UserRepository.update(req.params.id, user)
  return res.json(data)
})

router.post('/', [
  body('username').isAlphanumeric().withMessage(`username required`),
  body('password').isAlphanumeric().withMessage(`password required`),
  body('role').isAlpha().withMessage(`role required/alpha`),
  validate,
], async (req, res) => {
  const user = {
    username: req.body.username,
    password: req.body.password,
    role: req.body.role,
  }
  const data = await UserRepository.create(user)
  return res.json(data)
})

router.delete('/:id', async (req, res) => {
  const data = await UserRepository.destroy(req.params.id)
  return res.json(data)
})

module.exports = router