// Database
// ========
// Connect to the relational database

'use strict';

var knex      = require('knex')(require(__dirname + '/../../knexfile')['development']),
    bookshelf = require('bookshelf')(knex);

bookshelf.plugin('registry');

module.exports = bookshelf;
