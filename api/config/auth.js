module.exports.access = (req, res, next)=>{
  if(req.user) {return next()}
  res.json(null)
}

module.exports.canEdit = function canEdit(req, res, next) {
  if (req.body.username === req.user.username) {
    return next()
}
  res.status(403).send('Not authorized')
}

exports.logout = function (req, res) {
  if(req.user) {
    req.logout();
    res.status(200).send();
  } else {
      res.status(400).send('Not logged in');
  }
};
