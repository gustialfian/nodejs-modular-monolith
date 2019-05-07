const router = require('express').Router()
const { body } = require('express-validator/check')

const { validate } = require('../shared/validator')
const { register, login } = require('./authService')

router.post('/login', [
	body("username")
		.isAlphanumeric().withMessage(`username required`)
		.isLength({ min: 5, max: 50 }).withMessage(`min 5, max 50`),
	body("password").isAlphanumeric().withMessage(`password required`),
	validate,
], async (req, res) => {
	try {
		const token = await login(req.body.username, req.body.password)
		return res.json({ msg: 'telah masuk', token })
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
})

router.post('/register', [
	body("username")
		.isAlphanumeric().withMessage(`username required`)
		.isLength({ min: 5, max: 50 }).withMessage(`min 5, max 50`),
	body("password").isAlphanumeric().withMessage(`password required`),
	body("role").isAlphanumeric().withMessage(`password required`),
	validate,
], async (req, res) => {
	const user = {
		username: req.body.username,
		password: req.body.password,
		role: req.body.role,
	}

	try {
		const newUser = await register(user)
		return res.json({ msg: 'user dibuat', data: newUser})
	} catch (error) {
		return res.status(500).json({ msg: error.message })
	}
})

module.exports = router