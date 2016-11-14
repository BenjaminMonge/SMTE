const passport = require('passport')
//Session methods, no other controller needed

module.exports.session = (req, res) => {
  var found = req.user
  res.json({'username':found.username, 'email': found.email, 'fullname': found.fullname, 'joinDate': found.joinDate})
}

module.exports.logout = (req, res)=>{
  if(req.user) {
    req.logout();
    res.status(200).send();
  } else {
    res.status(400).send("Not logged in");
  }
}

module.exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    var error = err || info;
    if (error) { return res.status(400).json(error) }
    else {
      req.logIn(user, (err) => {
        console.log(req.user);
        if (err) { return res.send(err)}
        else {
          res.json({'username': user.username, 'email': user.email})
        }
      });
    }
  })(req, res, next);
}
