"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("orders", [
      {
        name: "Alex",
        email: "example@mail.com",
        size: "small",
        town: "Dnipro",
        date: "2021-02-10",
        time: "12:00",
        masterId: 1,
        endTime: "13:00",
      },
      {
        name: "Genadii",
        email: "mySuperMail@mail.com",
        size: "large",
        town: "Uzhorod",
        date: "2021-04-10",
        time: "12:00",
        masterId: 2,
        endTime: "15:00",
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("orders", null, {});
  },
};
