//Dependencies
const bodyParser = require('body-parser')
const auth = require('../config/auth')
const sessionCtrl = require('../controllers/session');
const userCtrl = require('../controllers/user');
const patientCtrl = require('../controllers/patient');
//Router

module.exports = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  //Routes for authentication and session maintaining
  app.get('/api/sessions', auth.access, sessionCtrl.session)
  app.post('/api/sessions', sessionCtrl.login)
  app.delete('/api/sessions', sessionCtrl.logout)
  //CRUD operations for user model
  app.post('/api/users/', userCtrl.create);
  app.get('/api/users/:username', userCtrl.get);
  app.put('/api/users/:username', userCtrl.update);
  app.delete('/api/users/:username', userCtrl.delete)
  //Patients
  app.get('/api/patients/:id', patientCtrl.get)
  app.get('/api/patients', patientCtrl.search)
  //Monitoring
  app.post('/api/monitors/', userCtrl.addP)
  app.delete('/api/monitors/:deviceid', userCtrl.deleteP)
}
