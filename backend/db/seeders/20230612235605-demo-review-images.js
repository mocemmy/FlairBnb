'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviewImages = [
  {
    reviewId: 1,
    url: '../images/seederImages/apartmentImage.jpg',
  },
  {
    reviewId: 2,
    url: '../images/seederImages/bnbImage.jpg',
  },
  {
    reviewId: 3,
    url: '../images/seederImages/lakeHouseImage.jpg',
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkInsert(options, reviewImages, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId: {
        [Op.in]: [1, 2, 3]
      }
    })
  }
};
