'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Spots';

const spots = [
  {
    ownerId: 1,
    address: '123 University City Blvd',
    city: 'Blacksburg',
    state: 'Virginia',
    country: "USA",
    lat: 40.2221,
    lng: 120.2323,
    name: 'Hokie Haven',
    description: 'A quaint apartment',
    price: 199.99,
  },
  {
    ownerId: 2,
    address: '714 DeHart St',
    city: 'Blacksburg',
    state: 'Virginia',
    country: "USA",
    lat: 56.2345,
    lng:-130.2341,
    name: 'Airport Stay',
    description: 'A convenient walk to the airport',
    price: 300.50,
  },
  {
    ownerId: 3,
    address: '7013 Bandy Rd',
    city: 'Richmond',
    state: 'Virginia',
    country: "USA",
    lat: -80.3923,
    lng: 140.234,
    name: 'Cozy Colonial',
    description: 'A colonial inspired home nearby the university',
    price: 599.99,
  },
  {
    ownerId: 2,
    address: '1245 Oak River Ct',
    city: 'Chesterfield',
    state: 'Virginia',
    country: "USA",
    lat: 78.9083,
    lng: -160.2345,
    name: 'Lake House',
    description: 'Beautiful house on the lake',
    price: 499.99,
  },
  {
    ownerId: 1,
    address: '2222 River Rd',
    city: 'Henrico',
    state: 'Virginia',
    country: "USA",
    lat: 11.9321,
    lng: 77.9999,
    name: 'Quaint Abode',
    description: 'A bnb on the beautiful River Road',
    price: 669.39,
  },
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, spots, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: {
        [Op.in]: ['Hokie Haven', 'Airport Stay', 'Cozy Colonial', 'Lake House', 'Quaint Abode']
    }
  })
  }
};
