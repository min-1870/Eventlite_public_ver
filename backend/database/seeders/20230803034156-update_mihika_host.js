/**
 * Seed file for updating events' host status.
 * Automatically generated by sequelize.
 * DO NOT MODIFY
 */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const event1 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "End of Semester Party",
      }
    }, ['id']);

    const event2 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Christmas Party",
      }
    }, ['id']);

    const event3 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Wedding",
      }
    }, ['id']);

    const event4 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Funeral",
      }
    }, ['id']);

    const event5 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Cruise Party",
      }
    }, ['id']);

    const event6 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Ben's Birthday",
      }
    }, ['id']);

    const userMihika = await queryInterface.rawSelect('Users', {
      where: {
        username: 'Mihika'
      },
    }, ['id']);


    if (event1 !== undefined && event2 !== undefined && userMihika !== undefined) {
      return Promise.all([
        queryInterface.bulkUpdate('Users', {
          eventsHosted: `{${event1},${event2},${event3},${event4},${event5},${event6}}`
        }, {
          id: userMihika
        })
      ])
    }
  },

  async down(queryInterface, Sequelize) {

    const userMihika = await queryInterface.rawSelect('Users', {
      where: {
        username: 'Mihika'
      },
    }, ['id']);

    return Promise.all([
      queryInterface.bulkUpdate('Users', {
        eventsHosted: `{}`
      }, {
        id: userMihika
      })
    ])
  }
};
