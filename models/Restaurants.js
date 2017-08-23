module.exports = function(sequelize, DataTypes) {
  var Restaurants = sequelize.define("restaurants", {
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
    piclink: {
      type:  DataTypes.STRING,
      allowNull: true
    }
  });

  Restaurants.associate = function (models) {
    Restaurants.hasMany(models.plates, {
        foreignKey:'RestID',
          onDelete: "cascade"
      });
    };

    Restaurants.associate = function (models) {
      Restaurants.hasMany(models.guests, {
          foreignKey:'RestID',
            onDelete: "cascade"
        });
      };

      Restaurants.associate = function (models) {
        Restaurants.hasMany(models.purchases, {
            foreignKey:'RestID',
              onDelete: "cascade"
          });
        };
  return Restaurants;
};