'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Relations
// db.guests.belongsToMany(db.purchases {through 'Guest_Purchases', foreignKey: 'GuestU_ID'});
// db.purchases.belongsToMany(db.guests, {through 'Guest_Purchases', foreignKey: 'PurchGuestID'});

db.guests.hasMany(db.purchases);
db.purchases.belongsTo(db.guests);
// db.purchases.belongsToMany(db.plates, {through: "plates_purchases"});
// db.plates.belongsToMany(db.purchases, {through: "plates_purchases"});
db.restaurants.hasMany(db.plates,{constraints: false}, {as: "RestID"});
// db.plates.belongsTo(db.restaurants);
db.plates.hasMany(db.purchases);
db.purchases.belongsTo(db.plates);
// db.purchases.hasMany(db.plates);
db.restaurants.hasMany(db.purchases,{constraints: false});
db.purchases.belongsTo(db.restaurants,{constraints: false});
// db.restaurants.belongsToMany(db.purchases, {through: "restaurant_purchases"});
// db.purchases.belongsToMany(db.restaurants, {through: "restaurant_purchases"});


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;