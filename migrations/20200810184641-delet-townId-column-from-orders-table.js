'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("orders", "townId")
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("orders", "townId", Sequelize.INTEGER)
  }
};
