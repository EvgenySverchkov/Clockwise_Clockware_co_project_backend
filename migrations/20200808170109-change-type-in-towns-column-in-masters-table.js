"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("masters", "towns", Sequelize.STRING);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("masters", "towns", Sequelize.INTEGER);
  },
};
