//Dependencies
const auth = require('../config/auth')
const sessionCtrl = require('../controllers/session');
const userCtrl = require('../controllers/user');
const patientCtrl = require('../controllers/patient');
const bodyParser = require('body-parser')
const Patient = require('../models/patient');
var twilio = require('twilio')('ACf44670cb2fbae6d5bc2b1a71fcc96cf4', 'dd5b6700e26166fb8f85d1438cf1b2fa');
//Router

module.exports = (app, io) => {
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
  //Parsing data
  app.post('/arduino/', (req, res)=>{
        const room = 'stream:'+req.body.ID;//el id que mandes con el arduino, que sera el mismo deviceid del paciente que crees en la base de datos
        info = {bpm: req.body.BPM}  //En este debes poner el bpm que viene en la request
        console.log(info);
        io.to(room).emit('bpm', info)           //Al recibir los datos del arduino por post request los emite en el sitio del paciente*/

        if(info.bpm<=40 || info.bpm>=120){  //Enviar el mensaje de alerta cuando el bpm presenta rangos irregulares

          var msg = null
          Patient.where({'deviceid': req.body.ID}).fetch().then((model)=>{
          msg = 'El paciente '+model.attributes.fullname+' presenta latidos anormales. Latidos/minuto: '+info.bpm+' ';
          console.log(msg);
          twilio.sendMessage({
              to:'+50363004746',
              from: '+15713897109',
              body: msg
          }, function(err, responseData) {
              if (!err) {
                  console.log(responseData.from);
                  console.log(responseData.body);
              }
          });

        });

        }



  }
)

  app.post('/alert/', (req, res)=>{
    var msg = null
    Patient.where({'deviceid': req.body.ID}).fetch().then((model)=>{
    msg = 'El paciente '+model.attributes.fullname+' ha sufrido una caida y necesita ayuda';
    console.log(msg);
    twilio.sendMessage({
        to:'+50363004746',
        from: '+15713897109',
        body: msg
    }, function(err, responseData) {
        if (!err) {
            console.log(responseData.from);
            console.log(responseData.body);
        }
    });

  });

  })
}
