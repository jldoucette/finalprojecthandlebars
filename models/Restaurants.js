module.exports = function(sequelize, DataTypes) {
  var Restaurants = sequelize.define("restaurants", {
    restname: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    address: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    hours: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    email: {
      type:  DataTypes.STRING,
      allowNull: true
    },
    createdBy: {
      type:  DataTypes.STRING,
      allowNull: true
    },
    piclink: {
      type:  DataTypes.STRING,
      allowNull: true
    }
  });
      
  return Restaurants;
};