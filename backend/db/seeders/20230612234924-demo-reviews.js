'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviews = [
  {
    spotId: 1,
    userId: 1,
    review: 'The place smelled like smoke',
    stars: 2,
  },
  {
    spotId: 1,
    userId:3,
    review: 'Convenient for the bus line',
    stars: 4
  },
  {
    spotId: 5,
    userId: 3,
    review: 'Such a beautiful part of the city!',
    stars: 5,
  },
  {
    spotId: 4,
    userId: 2,
    review: 'The deck on this place is massive, but the lake was full of boat traffic',
    stars: 4,
  },
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    return  queryInterface.bulkInsert(options, reviews, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1, 5, 4]
      }
    })
  }
};
