"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    const createMastersTable = queryInterface.createTable("masters", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      rating: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    const createTownsTable = queryInterface.createTable("townsnames", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    const createOrdersTable = queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      size: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      town: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      masterId: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    const createUsersTable = queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
    const createMastersTownsTable = queryInterface.createTable(
      "masters_towns",
      {
        masterId: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
        },
        townsnameId: {
          type: Sequelize.INTEGER.UNSIGNED,
          primaryKey: true,
        },
      }
    );

    return Promise.all([
      createMastersTable,
      createTownsTable,
      createOrdersTable,
      createUsersTable,
      createMastersTownsTable,
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropAllTables();
  },
};
