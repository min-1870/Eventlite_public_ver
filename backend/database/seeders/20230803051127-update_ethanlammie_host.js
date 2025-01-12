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
        event_name: "Rewilding",
      }
    }, ['id']);

    const event2 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Emo vs anime",
      }
    }, ['id']);

    const event3 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Dave Chapelle comedy show",
      }
    }, ['id']);

    const event4 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Black Pink concert",
      }
    }, ['id']);

    const event5 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Jersey Boys",
      }
    }, ['id']);

    const event6 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "ESL Sydney",
      }
    }, ['id']);

    const event7 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "ESL Boston",
      }
    }, ['id']);
    const event8 = await queryInterface.rawSelect('Events', {
      where: {
        event_name: "Bill Burr comedy show",
      }
    }, ['id']);

    const userEthan = await queryInterface.rawSelect('Users', {
      where: {
        username: 'ethanLammie'
      },
    }, ['id']);

    if (event1 !== undefined && event2 !== undefined && userEthan !== undefined) {
      return Promise.all([
        queryInterface.bulkUpdate('Users', {
          eventsHosted: `{${event1},${event2},${event3},${event4},${event5},${event6},${event7},${event8}}`
        }, {
          id: userEthan
        })
      ])
    }
  },

  async down(queryInterface, Sequelize) {
    const userEthan = await queryInterface.rawSelect('Users', {
      where: {
        username: 'ethanLammie'
      },
    }, ['id']);

    return Promise.all([
      queryInterface.bulkUpdate('Users', {
        eventsHosted: `{}`
      }, {
        id: userEthan
      })
    ])
  }
};
