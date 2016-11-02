'use strict'

const Bookshelf = require('./database');

var User = Bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: false
  });

module.exports = Bookshelf.model('User', User)
