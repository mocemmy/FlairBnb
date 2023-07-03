'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'SpotImages';

const spotImages = [
  {
    spotId: 1,
    url: 'https://www.exploregeorgia.org/sites/default/files/styles/hero_xs/public/2020-02/treehouse-flintstone-credit-ben-galland.jpg?itok=S1DZrPXp',
    preview: true,
  },
  {
    spotId: 2,
    url: 'https://www.alaskacollection.com/Alaska/media/Images/Stories/2021/06/MBN-Alaska-Hotels-For-Every-Style-Cabins-River.jpg?ext=.jpg',
    preview: true,
  },
  {
    spotId: 3,
    url: 'https://localadventurer.com/wp-content/uploads/2018/10/unique-hotels-in-atlanta.jpg',
    preview: true,
  },
  {
    spotId: 4,
    url: 'https://localadventurer.com/wp-content/uploads/2018/10/best-place-to-stay-in-atlanta-ga.jpg',
    preview: true,
  },
  {
    spotId: 5,
    url: 'https://localadventurer.com/wp-content/uploads/2018/10/bed-and-breakfast-atlanta-ga.jpg',
    preview: true,
  },
]

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
