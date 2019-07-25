
const registerRoute = (app) => {
  app.get('/', (req, res) => {
    res.json({ msg: 'safe' })
  })
}

module.exports = {
  registerRoute
}