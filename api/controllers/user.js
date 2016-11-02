const User = require('../models/user');
const passport = require('passport')
const Promises = require('bluebird');
const bcrypt = Promises.promisifyAll(require('bcryptjs'));
//Date conversion
function getToday() {
  var date = new Date().toISOString().slice(0, 19).replace('T', ' ');
  return date
}

//Session methods, no other controller needed
module.exports.session = (req, res) => {
  var found = req.user
  res.json({'username':found.username, 'email': found.email})
}

module.exports.logout = (req, res)=>{
  if(req.user) {
    req.logout();
    res.send(200);
  } else {
    res.send(400, "Not logged in");
  }
}

module.exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    var error = err || info;
    if (error) { return res.status(400).json(error) }
    else {
      req.logIn(user, (err) => {
        if (err) { return res.send(err)}
        else {
          res.json({'username': user.username, 'email': user.email})
        }
      });
    }
  })(req, res, next);
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
