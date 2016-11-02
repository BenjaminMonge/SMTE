const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

passport.serializeUser((user, done)=>{
  done(null, user.username)
})

passport.deserializeUser((username, done)=>{
  User.where({'username':username}).fetch().then((model)=>{
    done(null, model.attributes)
  }).catch((err)=>{
    return done(err, null)
  })
  })

passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function (username, password, done) {
    User.where({'username':username}).fetch().then((model)=>{
      if(!model){
        return done(null, false, {
          'errors': {
            'username': { type: 'Username is not registered.' }
          }
        })
      }

      bcrypt.compare(password, model.attributes.password, (err, res)=>{
        if(!res){
          return done(null, false, {
            'errors': {
            'password': { type: 'Password is incorrect.' }
          }
          })
        }
        return done(null, model.attributes)
      })

    }).catch((err)=>{
      return done(err)
    })
}))
