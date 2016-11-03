const passport = require('passport')
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
