module.exports = function(sequelize, DataTypes) {
    var Guest = sequelize.define("guests", {
      // Giving the Guest model first_name, last_name
      first_name: {type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len:[1]
        }
      },
      last_name: {type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len:[1]
        }
      },
       username: {type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len:[1]
        }
      },
      address: {type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len:[1]
        }
      },
      phone: {type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len:[1]
        }
      },
      email: {type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len:[1]
        }
      },
         restID: {type: DataTypes.STRING,
        allowNull: true,
      },

        password: {type: DataTypes.STRING,
        allowNull: false,
      },
      //user can have role: Client, Manger
      user_role: {type: DataTypes.STRING,
        allowNull: false,
      }
    });

  
    return Guest;
  };