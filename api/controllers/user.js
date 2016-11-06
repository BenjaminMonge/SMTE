const User = require('../models/user');
const passport = require('passport')
const Promises = require('bluebird');
const bcrypt = Promises.promisifyAll(require('bcryptjs'));
const Carers = require('../models/carers');

//Date conversion
function getToday() {
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  return date
}
//Operations for crud
module.exports.create = (req, res)=>{
  var body = req.body;
    bcrypt.hashAsync(body.password, 10)
        .then(function(hash) {
          //creation of model
          var newborn = {
            username: body.username,
            email: body.email,
            password: hash,
            fullname: body.fullname,
            joinDate: getToday()
          }
          return new User(newborn).save(null, {method: 'insert'});
        })
        .then(function(user) {
          req.logIn(body, (err) => { //Log in and send info
            if (err) { return res.send(err) }
            res.json({'username': body.username, 'email': body.email})
          });
        })
        .catch(function(err) {
          console.log(err);
          res.statusCode = 400
          res.send('This account already exists, try again with different data');
        });

}
//Getting data for the dashboard
module.exports.get = (req, res)=>{
  User.where({'username': req.params.username}).fetch({withRelated: ['patients']}).then((models)=>{
    if (models.related('patients')) {
      toSend= models.toJSON()
      res.send(toSend)
    } else {
      res.send('None')
    }
  }).catch((err)=>{
    console.log(err);
  })
}

module.exports.update = (req, res)=>{
  res.status(404).send()
}

module.exports.delete = (req, res)=>{
  req.logout();
  User.forge({username: req.params.username}).destroy().then((model)=>{
    console.log('deleted');
    res.status(200).send()
  }).catch((err)=>{
    console.log(err);
    res.send(err)
  })
}

module.exports.addP = (req, res)=>{
  var relation = {user_username: req.user.username, patient_deviceid: req.body.deviceid}
  var caring = new Carers(relation)
  caring.save().then((carer)=>{
    res.send('success in adding')
  }).catch((err)=>{
    res.send('You already added this user')
  })
}

module.exports.deleteP = (req, res)=>{
  var relation = {user_username: req.user.username, patient_deviceid: String(req.params.deviceid)}
  new Carers(relation).fetch().then((fModel)=>{
    if (fModel) {
      fModel.destroy()
      res.send('success in deleting')
    } else {
      res.send('not found')
    }

  }).catch((err)=>{
    console.log(err);
    res.send(err)
  })
}
