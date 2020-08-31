'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("orders", "endTime");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("orders", "endTime", {
      type: Sequelize.STRING,
      allowNull: false
    });
  }
};
