
exports.up = function(knex) {
    return knex.schema.createTable('numeracaocheque', function(table){
        table.string('id').primary();
        table.string('cmc7Modelo').notNullable();
        table.integer('numero').notNullable();
      });
};

exports.down = function(knex) {
  return knex.schema.dropTable('numeracaocheque');
};
