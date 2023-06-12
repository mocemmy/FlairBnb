'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId'
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId'
      })

      Spot.belongsToMany(models.User, {
        through: models.Review,
        foreignKey: 'spotId',
        otherKey: 'userId'
      })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL(6,4),
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(6,4),
      validate: {
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false
  },
 }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};