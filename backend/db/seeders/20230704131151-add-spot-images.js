'use strict';
const bcrypt = require('bcryptjs');

let options = {};
if(process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.tableName = 'SpotImages';
//need to add at least 4 more images to each spot for design
const spotImages = [
  {
    spotId: 1,
    url: `https://media.cntraveler.com/photos/5f11aa59f644feb870fcc946/16:9/w_2580,c_limit/38849710-2-airbnb-log.jpg`,
    preview: false
  },
  {
    spotId: 1,
    url: `https://www.dailydreamdecor.com/wp-content/uploads/2020/12/cozy-cabin-in-the-woods.jpeg`,
    preview: false
  },
  {
    spotId: 1,
    url:  'https://scontent-iad3-2.xx.fbcdn.net/v/t1.6435-9/34416359_609497989410525_497282519100555264_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=730e14&_nc_ohc=xVT5-7B-FREAX-3ti21&_nc_ht=scontent-iad3-2.xx&oh=00_AfAHAadUAVi41O8nT3q7nWK53WIBd3HpmgmBHsxCrzuSrQ&oe=64CBA738',
    preview: false
  },
  {
    spotId: 1,
    url: 'https://scontent-iad3-1.xx.fbcdn.net/v/t1.6435-9/34471410_609498029410521_2888405024554090496_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=730e14&_nc_ohc=dI1iVIOPHUUAX9hyI7v&_nc_ht=scontent-iad3-1.xx&oh=00_AfCleohYqip7GOWBUNMmejn72rH6_BoEc7jtABy4TX0jrw&oe=64CB8B21',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://www.southernliving.com/thmb/NxOB1ZcjJwWfbuA-SvkDJy4UTyg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/2140101_richa_019_0-1-3a1698c9aea746e49a2009def7829517.jpg',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://www.southernliving.com/thmb/brTMm1CUBs11BzWKuTl1WCh5PR8=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/pr_7311_hmwals101219106-1-89127aeeaf4b48248ff3795abd94a5a0.jpg',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://www.southernliving.com/thmb/DXi4ZCD7lxpQZfzYV9y58rVywms=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/1132907_ideah_familyroom_overall-050664_0-dd473da5631a48dfbdfa31b80be08dda.jpg',
    preview: false
  },
  {
    spotId: 2,
    url: 'https://www.southernliving.com/thmb/pXECddzimPbkFMwcxXrr1kgfNHM=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/690401_berar256_0-1-a8811613857b496d99f94c4861ad1eb3.jpg',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://plus.unsplash.com/premium_photo-1680100256078-550ee2a5e126?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://images.unsplash.com/photo-1606074280798-2dabb75ce10c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=735&q=80',
    preview: false
  },
  {
    spotId: 3,
    url: 'https://images.unsplash.com/photo-1614607242094-b1b2cf769ff3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=686&q=80',
    preview: false
  },
  {
    spotId: 4,
    url: 'https://www.bhg.com/thmb/Qo-q0mYsfPVcGsTNJyrXTvWx-P4=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/cottage-style-bedroom-checked-bedspread-73f8e576-56f6361864e544998add451f66a8c3b6.jpg',
    preview: false
  },
  {
    spotId: 4,
    url: 'https://www.bhg.com/thmb/Z0Hxzv9YS1ZLt7jxs3NyAqNZWcI=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/sofa-chairs-around-table-living-room-B9IhpQu_KtAA6QisMZA43w-71c8f12d1abc497b98a0a6b25ab181d6.jpg',
    preview: false
  },{
    spotId: 4,
    url: 'https://www.bhg.com/thmb/N4XoHS8mnUs-eB_W9OxDUf3B6rk=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/bedroom-butterfly-portrait-pillows-0a483cd8-05fd3e4def3f4e22a9f31f21704ed272.jpg',
    preview: false
  },{
    spotId: 4,
    url: 'https://www.bhg.com/thmb/0UeO9YklcGn1YzHeKfvnKbhMw1Y=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/cottage-dining-room-by-windows-dac8c2fa-a25060c31f9749d082e2c3ad0af412dc.jpg',
    preview: false
  },
  {
    spotId: 5,
    url: 'https://www.bhg.com/thmb/-iAPkcaGxWO2SYAB4gCkpwnaowA=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/bright-red-living-room-bad7c5cc-7f885c6b09b24021a269dd820707ae04.jpg',
    preview: false
  },
  {
    spotId: 5,
    url: 'https://www.bhg.com/thmb/v_hw9a3NzsniJzl9cKodlyHg3_U=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/black-white-buffalo-check-wall-panels-18mc0Fr442v84CFVWihUvC-58309c4d0595407195e8e275a8e47e4d.jpg',
    preview: false
  },
  {
    spotId: 5,
    url: 'https://www.bhg.com/thmb/kv_uixrMN5c5z96EI2vK0_xZ1Bo=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/kitchen-white-cabinets-wood-top-DuiZDVMOas9Bs6D1WkpK4r-cd14410333214af7af5a14b0ccda6efb.jpg',
    preview: false
  },
  {
    spotId: 5,
    url: 'https://www.bhg.com/thmb/Ee016yL-iG7REB-axebB6o2jNPY=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/four-seasons-room-tile-floor-b2e28351-90500cf31d6d45a49a6663fc766482a7.jpg',
    preview: false
  }
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
