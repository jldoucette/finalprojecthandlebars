module.exports = function(sequelize, DataTypes) {
  var Purchases = sequelize.define("purchases", {
    quantity: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    purchaserID: {
      type:  DataTypes.STRING,
      allowNull: false
    }, 
    restID: {
      type:  DataTypes.STRING,
      allowNull: false
    }
  });

 
  return Purchases;
};