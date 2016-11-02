
exports.up = function(knex, Promise) {
  return Promise.all([

   knex.schema.createTableIfNotExists('users', function(table) {
     table.string('username').primary();
     table.string('email').unique();
     table.string('password');
     table.string('fullname')
     table.date('joinDate');
   }),

   knex.schema.createTableIfNotExists('patients', function(table) {
     table.string('deviceid').primary();
     table.string('fullname');
     table.string('sosphone');
   })

 ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
   knex.schema.dropTable('users'),
   knex.schema.dropTable('patients')
 ]);
};
