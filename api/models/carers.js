'use strict'

const Bookshelf = require('./database');
const Patient = require('./patient')

var Carers = Bookshelf.Model.extend({
    tableName: 'patients_users',
    hasTimestamps: false,
    patients: function () {
      return this.hasMany(Patient)
    }
  });

module.exports = Bookshelf.model('Carers', Carers)
