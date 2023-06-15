'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'Owner'
      })

      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: 'spotId',
        otherKey: 'userId'
      })
      
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId',
        onDelete: 'CASCADE',
        hooks: true
      })

      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId',
        as: 'previewImage',
        onDelete: 'CASCADE',
        hooks: true
      })

    }
  }
  Spot.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
      },
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
    country: {
      type: DataTypes.STRING,
    },
    lat: {
      type: DataTypes.DECIMAL(6,4),
      validate: {
        min: -90,
        max: 90
      }
    },
    lng: {
      type: DataTypes.DECIMAL(7,4),
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