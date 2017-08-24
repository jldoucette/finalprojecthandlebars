module.exports = function(sequelize, DataTypes) {
  var Plates = sequelize.define("plates", {
    plate_name: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    protein: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    side1: {
      type:  DataTypes.STRING,
      allowNull: true
    },
    side2: {
      type:  DataTypes.STRING,
      allowNull: true
    },
    side3: {
      type:  DataTypes.STRING,
      allowNull: true
    },
    price: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    description: {
      type:  DataTypes.STRING,
      allowNull: false
    },
    createdby: {
      type: DataTypes.STRING,
      allowNull:false
    },
    preptime:  {
      type: DataTypes.STRING,
      allowNull:false
    },
    delaytime:  {
      type: DataTypes.STRING,
      allowNull:false
    },
    createdate: {
      type: DataTypes.STRING,
      allowNull:false
    },
    piclink: {
      type:  DataTypes.STRING,
      allowNull: true
    }
  });

 
  return Plates;
};