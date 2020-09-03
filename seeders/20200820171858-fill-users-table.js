"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("users", [
      {
        email: "admin@example.com",
        password:
          "$2b$10$3VGX/eBF4B2Ae98L.dimyugsnteMlNMBQBUF23iSwLq1lNHNqoOQi",
        name: "admin",
        role: "admin",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
