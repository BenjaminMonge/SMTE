const User = require('../models/user');
const passport = require('passport')
const Promises = require('bluebird');
const bcrypt = Promises.promisifyAll(require('bcryptjs'));
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
          return new User(newborn).save();
        })
        .then(function(user) {
          console.log(user.attributes);
          res.json({'username': body.username, 'email': body.email, 'estado': 'Su usuario fue creado correctamente'})
        })
        .catch(function(err) {
          res.statusCode = 400
          res.send('This account already exists, try again with different data');
        });

}
