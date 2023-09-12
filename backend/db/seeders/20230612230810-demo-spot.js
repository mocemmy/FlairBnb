'use strict';
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

options.tableName = 'Spots';

const spots = [
  { //1
    ownerId: 1,
    address: "123 Main Street",
    city: "Los Angeles",
    state: "California",
    country: "United States",
    name: "Cozy Downtown Apartment",
    description: "A charming apartment in the heart of the city with great views.",
    price: 150
  },
  { //2
    ownerId: 2,
    address: "456 Elm Avenue",
    city: "New York",
    state: "New York",
    country: "United States",
    name: "Luxury Loft in Manhattan",
    description: "Spacious and modern loft with all the amenities you need for a comfortable stay.",
    price: 300
  },
  { //3
    ownerId: 3,
    address: "789 Oak Street",
    city: "San Francisco",
    state: "California",
    country: "United States",
    name: "Vintage Victorian House",
    description: "Experience the charm of a historic Victorian house in a trendy neighborhood.",
    price: 200
  },
  { //4
    ownerId: 4,
    address: "101 Pine Road",
    city: "Miami",
    state: "Florida",
    country: "United States",
    name: "Beachfront Villa with Pool",
    description: "Relax in style with direct beach access and a private pool.",
    price: 500
  },
  { //5
    ownerId: 5,
    address: "234 Maple Lane",
    city: "Chicago",
    state: "Illinois",
    country: "United States",
    name: "Modern Condo with Skyline Views",
    description: "Enjoy stunning views of the Chicago skyline from this sleek and modern condo.",
    price: 180
  },
  { //6
    ownerId: 6,
    address: "567 Willow Avenue",
    city: "Austin",
    state: "Texas",
    country: "United States",
    name: "Spacious Family Home with Backyard Oasis",
    description: "Perfect for families, this home features a large backyard with a pool and play area.",
    price: 250
  },
  { //7
    ownerId: 1,
    address: "345 Oakwood Drive",
    city: "Seattle",
    state: "Washington",
    country: "United States",
    name: "Rustic Cabin in the Woods",
    description: "Escape to nature in this cozy cabin surrounded by towering trees.",
    price: 120
  },
  { //8
    ownerId: 2,
    address: "789 Pinehurst Place",
    city: "Orlando",
    state: "Florida",
    country: "United States",
    name: "Golf Resort Getaway",
    description: "Stay and play at this golf resort with access to world-class courses.",
    price: 280
  },
  { //9
    ownerId: 3,
    address: "1010 Beachfront Road",
    city: "San Diego",
    state: "California",
    country: "United States",
    name: "Beach House Paradise",
    description: "Unwind with the sound of ocean waves in this beautiful beachfront property.",
    price: 350
  },
  { //10
    ownerId: 4,
    address: "123 Riverside Drive",
    city: "Boston",
    state: "Massachusetts",
    country: "United States",
    name: "Historic Brownstone Apartment",
    description: "Experience the charm of Boston in this historic brownstone apartment.",
    price: 220
  },
  { //11
    ownerId: 5,
    address: "456 Lakeside Lane",
    city: "Denver",
    state: "Colorado",
    country: "United States",
    name: "Mountain View Retreat",
    description: "Enjoy the tranquility of the Rockies from this mountain-view retreat.",
    price: 190
  },
  { //12
    ownerId: 6,
    address: "789 Riverfront Way",
    city: "Portland",
    state: "Oregon",
    country: "United States",
    name: "Modern Loft near Waterfront Park",
    description: "Experience urban living at its finest in this stylish loft close to the waterfront.",
    price: 220
  },
  { //13
    ownerId: 1,
    address: "345 Lakeside Drive",
    city: "Nashville",
    state: "Tennessee",
    country: "United States",
    name: "Music City Oasis",
    description: "Immerse yourself in the music scene of Nashville in this centrally located home.",
    price: 170
  },
  { //14
    ownerId: 2,
    address: "567 Forest View Drive",
    city: "Phoenix",
    state: "Arizona",
    country: "United States",
    name: "Desert Retreat with Pool",
    description: "Relax in the Arizona desert with a private pool and stunning mountain views.",
    price: 260
  },
  { //15
    ownerId: 3,
    address: "1010 Harborfront Road",
    city: "Charleston",
    state: "South Carolina",
    country: "United States",
    name: "Historic Charleston Townhouse",
    description: "Step back in time and explore the historic charm of Charleston from this townhouse.",
    price: 190
  },
  { //16
    ownerId: 4,
    address: "123 Mountainview Lane",
    city: "Asheville",
    state: "North Carolina",
    country: "United States",
    name: "Mountain Cabin Retreat",
    description: "Escape to the Blue Ridge Mountains in this cozy cabin with scenic views.",
    price: 140
  },
  { //17
    ownerId: 5,
    address: "456 Beachside Avenue",
    city: "Santa Barbara",
    state: "California",
    country: "United States",
    name: "Beachfront Bungalow",
    description: "Enjoy direct beach access and breathtaking sunsets in this beachfront bungalow.",
    price: 380
  },
  { //18
    ownerId: 6,
    address: "789 Vineyard Drive",
    city: "Napa Valley",
    state: "California",
    country: "United States",
    name: "Wine Country Villa",
    description: "Experience wine country living in this luxurious villa surrounded by vineyards.",
    price: 450
  },
  { //19
    ownerId: 1,
    address: "345 Parkside Place",
    city: "Denver",
    state: "Colorado",
    country: "United States",
    name: "Ski-in/Ski-out Chalet",
    description: "Hit the slopes with ease from this ski-in/ski-out chalet in the Rockies.",
    price: 320
  },
  { //20
    ownerId: 2,
    address: "567 Riverside Road",
    city: "Savannah",
    state: "Georgia",
    country: "United States",
    name: "Southern Charm Mansion",
    description: "Experience Southern hospitality in this grand mansion in the heart of Savannah.",
    price: 290
  },
  { //21
    ownerId: 3,
    address: "1010 Lakeshore Lane",
    city: "Lake Tahoe",
    state: "California",
    country: "United States",
    name: "Lakefront Cabin Getaway",
    description: "Enjoy the serenity of Lake Tahoe from this charming lakefront cabin.",
    price: 280
  },
  { //22
    ownerId: 4,
    address: "123 Hillside Road",
    city: "San Antonio",
    state: "Texas",
    country: "United States",
    name: "Spanish Colonial Villa",
    description: "Experience the beauty of San Antonio in this charming Spanish Colonial villa.",
    price: 260
  },
  { //23
    ownerId: 5,
    address: "456 Lakeshore Drive",
    city: "Miami Beach",
    state: "Florida",
    country: "United States",
    name: "Beachfront Penthouse",
    description: "Indulge in luxury with this beachfront penthouse offering stunning ocean views.",
    price: 600
  },
  { //24
    ownerId: 6,
    address: "789 Redwood Lane",
    city: "Seattle",
    state: "Washington",
    country: "United States",
    name: "Treehouse Retreat",
    description: "Escape to the treetops in this unique treehouse retreat with forest views.",
    price: 180
  },
  { //25
    ownerId: 1,
    address: "345 Desert View Drive",
    city: "Phoenix",
    state: "Arizona",
    country: "United States",
    name: "Desert Oasis with Pool",
    description: "Cool off in the desert heat with a private pool in this stylish oasis.",
    price: 220
  },
  { //26
    ownerId: 2,
    address: "567 Lakeside Road",
    city: "Orlando",
    state: "Florida",
    country: "United States",
    name: "Family-Friendly Vacation Home",
    description: "Perfect for families, this vacation home is close to Orlando's top attractions.",
    price: 190
  },
  { //27
    ownerId: 3,
    address: "1010 Vineyard Lane",
    city: "Napa Valley",
    state: "California",
    country: "United States",
    name: "Winery Retreat",
    description: "Live the wine country dream in this vineyard retreat with wine tasting.",
    price: 350
  },
  { //28
    ownerId: 4,
    address: "123 Riverside Drive",
    city: "New Orleans",
    state: "Louisiana",
    country: "United States",
    name: "French Quarter Condo",
    description: "Immerse yourself in the culture of New Orleans with this French Quarter condo.",
    price: 280
  },
  { //29
    ownerId: 5,
    address: "456 Mountainview Road",
    city: "Denver",
    state: "Colorado",
    country: "United States",
    name: "Mountain Cabin with Hot Tub",
    description: "Relax in the hot tub while taking in the breathtaking mountain views.",
    price: 240
  },
  { //30
    ownerId: 6,
    address: "789 Beachside Drive",
    city: "Hawaii",
    state: "Hawaii",
    country: "United States",
    name: "Beachfront Paradise",
    description: "Experience true Hawaiian paradise with this beachfront property in Hawaii.",
    price: 450
  },
  { //31
    ownerId: 1,
    address: "345 Lakeside Drive",
    city: "Lake Tahoe",
    state: "California",
    country: "United States",
    name: "Lakeview Chalet",
    description: "Enjoy stunning lake views and outdoor adventures from this Lake Tahoe chalet.",
    price: 320
  }
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(options, spots, {});
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: {
        [Op.in]: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
    }
  })
  }
};
