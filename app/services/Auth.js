angular.module('Monitoreo')
.factory('Auth',
  function ($location, $rootScope, Session, User) {
    $rootScope.currentUser =  null

    return {
      /* Describe el comportamiento para iniciar sesion*/
      login: function(provider, user, callback) {
        var cb = callback || angular.noop;
        Session.save({
          provider: provider,
          username: user.username,
          password: user.password,
          rememberMe: user.rememberMe
        }, function(user) {  /* La funcion devuelve el usuario y asigna su informacion*/
          $rootScope.$broadcast('verified', {'user': user})
          console.log('Success, welcome '+user.username);
          return cb(user.username, null)
        }, function( err) {
          return cb(null, err.data);
        });
      },

      logout: function(callback) {
        var cb = callback || angular.noop;
        Session.delete(function(res) {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err.data);
          });
      },
/* Usan el servicio usuario para crear y modificar el usuario actual*/
      /*createUser: function(userinfo, callback) {
        var cb = callback || angular.noop;
        User.save(userinfo,
          function(user) {
            $rootScope.currentUser = user;
            return cb(user.username);
          },
          function(err) {
            return cb(err.data);
          });
      },*/

      currUser: function() {
        Session.get(function(user) {
          if(!user.username){
            $rootScope.currentUser = null;
            $location.path('/')
          } else {
            $rootScope.$broadcast('verified', {'user': user})
          }
        });
      },



      removeUser: function(username, password, callback) {
        var cb = callback || angular.noop
        User.delete({
          username: email,
          password: password
        }, function(user) {
            console.log(user + 'removed');
            return cb();
        }, function(err) {
            return cb(err.data);
        })
      }

    }

    })
