'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImages = [
  {
    spotId: 1,
    url: '../images/seederImages/apartmentImage.jpg',
    preview: false,
  },
  {
    spotId: 2,
    url: '../images/seederImages/houseImage.jpg',
    preview: false,
  },
  {
    spotId: 3,
    url: '../images/seederImages/colonialHouseImage.jpg',
    preview: false,
  },
  {
    spotId: 4,
    url: '../images/seederImages/lakeHouseImage.jpg',
    preview: false,
  },
  {
    spotId: 5,
    url: '../images/seederImages/bnbImage.jpg',
    preview: false,
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    return queryInterface.bulkInsert(options, spotImages, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1,2,3,4,5]
      }
    })
  }
};
