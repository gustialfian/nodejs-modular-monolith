
const registerRoute = (app) => {
  app.use('/', require('./auth/authContoller'))
  app.use('/user', require('./user/userController'))
}

module.exports = {
  registerRoute
}