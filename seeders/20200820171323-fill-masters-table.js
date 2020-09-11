"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("masters", [
      {
        rating: 5,
        name: "Petrovich",
      },
      {
        rating: 4,
        name: "John Doe",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("masters", null, {});
  },
};
