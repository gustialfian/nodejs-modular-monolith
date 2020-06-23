
const registerRoute = (app) => {
  app.get('/', (req, res) => {
    res.json({ msg: 'safe' })
  })

  app.use('/sync', require('./module/syncing/handler'))
}

module.exports = {
  registerRoute
}