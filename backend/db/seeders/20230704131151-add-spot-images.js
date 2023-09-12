'use strict';
const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.tableName = 'SpotImages';
//need to add at least 4 more images to each spot for design
const spotImages = [
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.resolve()
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return Promise.resolve();
  }
};
