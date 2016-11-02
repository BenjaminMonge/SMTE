//Dependencies
const bodyParser = require('body-parser')
const auth = require('../config/auth')
const userCtrl = require('../controllers/user');
//Router

module.exports = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  //Routes for authentication and session maintaining
  app.get('/auth/session', auth.access, userCtrl.session)
  app.post('/auth/session', userCtrl.login)
  app.delete('/auth/session', userCtrl.logout)
  //CRUD operations for user model
  app.post('/api/user/', userCtrl.create);
  /*app.get('api/user/:username', userCtrl.get);
  app.put('api/user/:username', userCtrl.update);
  app.delete('api/user/:username', userCtrl.delete)*/
}
