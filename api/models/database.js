// Database
// ========
// Connect to the relational database

'use strict';
const cascadeDel = require('bookshelf-cascade-delete');
var knex      = require('knex')(require(__dirname + '/../../knexfile')['development']),
    bookshelf = require('bookshelf')(knex);

bookshelf.plugin(['registry', cascadeDel]);

module.exports = bookshelf;
