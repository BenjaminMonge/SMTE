
exports.up = function(knex, Promise) {
  return Promise.all([

   knex.schema.createTableIfNotExists('users', function(table) {
     table.string('username').primary();
     table.string('email').unique();
     table.string('password');
     table.string('fullname')
     table.date('joinDate');
   }).createTableIfNotExists('patients', function(table) {
     table.string('deviceid').primary();
     table.string('fullname');
     table.string('sosphone');
     table.string('address');
   }).createTableIfNotExists('patients_users', function(table) {
     table.increments();
     table.string('user_username').references('users.username');
     table.string('patient_deviceid').references('patients.deviceid');
     table.unique(['user_username', 'patient_deviceid']);
   })

 ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
   knex.schema.dropTable('users'),
   knex.schema.dropTable('patients'),
   knex.schema.dropTable('carers')
 ]);
};
