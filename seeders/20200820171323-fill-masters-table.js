"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("masters", [
      {
        rating: 5,
        towns: "Dnipro,Uzhorod",
        name: "Petrovich",
      },
      {
        rating: 4,
        towns: "Uzhorod",
        name: "John Doe",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("masters", null, {});
  },
};
