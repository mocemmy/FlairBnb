"use strict";
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
options.tableName = "Users";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      options,
      [
        {
          firstName: "Emily",
          lastName: "Morgan",
          email: "demo@user.io",
          username: "Demo-lition",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Jess",
          lastName: "Morgan",
          email: "user1@user.io",
          username: "FakeUser1",
          hashedPassword: bcrypt.hashSync("password2"),
        },
        {
          firstName: "Skylar",
          lastName: "Morgan",
          email: "user2@user.io",
          username: "FakeUser2",
          hashedPassword: bcrypt.hashSync("password3"),
        },
        {
          firstName: "John",
          lastName: "Doe",
          email: "john@email.com",
          username: "johndoe",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@email.com",
          username: "alicesmith",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Bob",
          lastName: "Johnson",
          email: "bob@email.com",
          username: "bobjohnson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Emily",
          lastName: "Brown",
          email: "emily@email.com",
          username: "emilybrown",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "David",
          lastName: "Lee",
          email: "david@email.com",
          username: "davidlee",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Sophia",
          lastName: "Wilson",
          email: "sophia@email.com",
          username: "sophiawilson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Oliver",
          lastName: "Martinez",
          email: "oliver@email.com",
          username: "olivermartinez",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Mia",
          lastName: "Garcia",
          email: "mia@email.com",
          username: "miagarcia",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Ethan",
          lastName: "Lopez",
          email: "ethan@email.com",
          username: "ethanlopez",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Ava",
          lastName: "Davis",
          email: "ava@email.com",
          username: "avadavis",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Ella",
          lastName: "Robinson",
          email: "ella.robinson@example.com",
          username: "ellarobinson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "James",
          lastName: "Martinez",
          email: "james.martinez@example.com",
          username: "jamesmartinez",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Ava",
          lastName: "Garcia",
          email: "ava.garcia@example.com",
          username: "avagarcia",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Daniel",
          lastName: "Brown",
          email: "daniel.brown@example.com",
          username: "danielbrown",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Mia",
          lastName: "Johnson",
          email: "mia.johnson@example.com",
          username: "miajohnson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Liam",
          lastName: "Wilson",
          email: "liam.wilson@example.com",
          username: "liamwilson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Emma",
          lastName: "White",
          email: "emma.white@example.com",
          username: "emmawhite",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Noah",
          lastName: "Smith",
          email: "noah.smith@example.com",
          username: "noahsmith",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Olivia",
          lastName: "Davis",
          email: "olivia.davis@example.com",
          username: "oliviadavis",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Logan",
          lastName: "Anderson",
          email: "logan.anderson@example.com",
          username: "logananderson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Lily",
          lastName: "Moore",
          email: "lily.moore@example.com",
          username: "lilymoore",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "William",
          lastName: "Johnson",
          email: "william.johnson@example.com",
          username: "williamjohnson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Sophia",
          lastName: "Brown",
          email: "sophia.brown@example.com",
          username: "sophiabrown",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Oliver",
          lastName: "Garcia",
          email: "oliver.garcia@example.com",
          username: "olivergarcia",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Charlotte",
          lastName: "Davis",
          email: "charlotte.davis@example.com",
          username: "charlottedavis",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Lucas",
          lastName: "Smith",
          email: "lucas.smith@example.com",
          username: "lucassmith",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Ava",
          lastName: "Anderson",
          email: "ava.anderson@example.com",
          username: "avaanderson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Ethan",
          lastName: "Wilson",
          email: "ethan.wilson@example.com",
          username: "ethanwilson",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Harper",
          lastName: "Martinez",
          email: "harper.martinez@example.com",
          username: "harpermartinez",
          hashedPassword: bcrypt.hashSync("password"),
        },
        {
          firstName: "Isabella",
          lastName: "Thomas",
          email: "isabella.thomas@example.com",
          username: "isabellathomas",
          hashedPassword: bcrypt.hashSync("password"),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        username: { [Op.in]: ["Demo-lition", "FakeUser1", "FakeUser2"] },
      },
      {}
    );
  },
};
