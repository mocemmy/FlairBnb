'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'SpotImages';

const spotData = new Array(31)
spotData.fill(null)
const spotImages = [];

// Loop through each spot and generate 5 images for each of the 31 seeded spots
spotData.forEach((spot, index) => {
  const spotId = index + 1;

  // Generate 5 images for each spot
  for (let i = 1; i <= 5; i++) {
    const isPreview = i === 1 ? true : false;
    const url = `/images/seederImages/${spotId}-${i}.png`
    console.log(url)
    spotImages.push({ spotId, url: url, preview: isPreview });
  }
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, spotImages, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: {
        [Op.in]: [1,2,3,4,5]
      }
    })
  }
};
