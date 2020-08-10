'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'masters',
      'towns',
      Sequelize.STRING
    )
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'masters',
      'towns',
      Sequelize.INTEGER
    )
  }
};
