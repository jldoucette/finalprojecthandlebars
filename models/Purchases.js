module.exports = function(sequelize, DataTypes) {
  var Purchases = sequelize.define("purchases", {
    quantity: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    paid: {
      type:  DataTypes.BOOLEAN,
      allowNull: false
    },
    completed: {
      type:  DataTypes.BOOLEAN,
      allowNull: false
    },
    createdate: {
      type: DataTypes.STRING,
      allowNull:false
    }
  
  });


 
  return Purchases;
};