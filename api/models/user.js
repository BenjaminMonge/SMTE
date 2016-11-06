'use strict'

const Bookshelf = require('./database');

require('./patient')
var User = Bookshelf.Model.extend({
    tableName: 'users',
    idAttribute: 'username',
    hasTimestamps: false,
    patients: function() {
      return this.belongsToMany('Patient')
    }
  }, {
      dependents: ['patients']
  });

module.exports = Bookshelf.model('User', User)
