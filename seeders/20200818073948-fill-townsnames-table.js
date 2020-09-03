"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "townsnames",
      [
        {
          name: "Dnipro",
        },
        {
          name: "Uzhorod",
        },
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("townsnames", null, {});
  },
};
