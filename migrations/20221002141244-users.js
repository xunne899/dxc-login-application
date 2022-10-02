'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db) {
  return db.createTable("users", {
    id: { 
      type: "int",
      primaryKey: true, 
      unsigned: true, 
      autoIncrement: true 
    },
    role_id:{                                                   
      type: 'int',
      unsigned: true,
      notNull: true,
      foreignKey: {
        name: 'position_role_fk',
        table: 'roles',
        mapping: 'id',
        rules: {
          onDelete: 'restrict',
          onUpdate: 'restrict'
        },
      }
    },
    username: { 
      type: "string", 
      length: 50 
    },
    email: { 
      type: "string", 
      length: 100 
    },
    password: { 
      type: "string", 
      length: 50
    },
    created_date:{
      type:"date"
    }
  });
};

exports.down = function (db) {
  return db.dropTable("users");
};
