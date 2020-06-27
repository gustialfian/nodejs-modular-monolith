
const registerRoute = (app) => {
  app.get('/', (req, res) => {
    res.json({ msg: 'safe' })
  })

  app.use('/api/auth', require('./module/users/authHandler'))
  app.use('/api/sync', require('./module/syncing/handler'))
  app.use('/api/users', require('./module/users/handler'))
}

module.exports = {
  registerRoute
}