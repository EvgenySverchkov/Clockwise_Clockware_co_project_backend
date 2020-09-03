"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("masters", "towns");
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("masters", "towns", {
      type: Sequelize.DataTypes.STRING,
    });
  },
};
