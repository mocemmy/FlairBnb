'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Bookings';

const bookings = [
  {
    spotId: 1,
    userId: 3,
    startDate: '2023-06-27',
    endDate: '2023-07-05'
  },
  {
    spotId: 3,
    userId: 2,
    startDate: '2023-06-19',
    endDate: '2023-07-01'
  },
  {
    spotId: 5,
    userId: 3,
    startDate: '2023-05-19',
    endDate: '2023-06-01'
  },
  {
    spotId: 2,
    userId: 1,
    startDate: '2023-09-10',
    endDate: '2023-09-15'
  }
]


module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, bookings, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {

    })
  }
};
