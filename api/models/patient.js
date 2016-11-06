'use strict'

const Bookshelf = require('./database');

require('./user')
var Patient = Bookshelf.Model.extend({
    tableName: 'patients',
    idAttribute: 'deviceid',
    hasTimestamps: false,
    users: function () {
      return this.belongsToMany('User')
    }
  });

module.exports = Bookshelf.model('Patient', Patient)
