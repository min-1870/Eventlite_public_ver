/**
 * Seed file for generating dummy events.
 * Automatically generated by sequelize.
 * DO NOT MODIFY
 */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const userMihika = await queryInterface.rawSelect('Users', {
      where: {
        username: 'Mihika'
      },
    }, ['id']);

    if (userMihika !== undefined) {
      return Promise.all([
        queryInterface.bulkInsert('Events', [
          {
            user_id: String(userMihika),
            event_name: "End of Semester Party",
            event_description: "This is a uni party",
            price: "{0}",
            location: "Roundhouse",
            tags: "{Music,Other}",
            event_date: "2023-11-15",
            event_time: "7:30",
            max_capacity: 100,
            current_capacity: 0,
            seats: "{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}",
            age_restriction: 21,
            joined_users: "{}",
            subscribed_users: "{}",
          }, {
            user_id: String(userMihika),
            event_name: "Christmas Party",
            event_description: "This is a fun Christmas party",
            price: "{10,20}",
            location: "My house",
            tags: "{Health,Music,Other}",
            event_date: "2023-11-09",
            event_time: "17:30",
            max_capacity: 50,
            current_capacity: 0,
            seats: "{-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20}",
            age_restriction: 18,
            joined_users: "{}",
            subscribed_users: "{}",
          }, {
            user_id: String(userMihika),
            event_name: "Wedding",
            event_description: "This is my Wedding, please come celebrate this important date",
            price: "{10,20,28}",
            location: "Church",
            tags: "{\"Food & Drink\"}",
            event_date: "2023-11-15",
            event_time: "16:30",
            max_capacity: 70,
            current_capacity: 0,
            seats: "{-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-10,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-20,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28,-28}",
            age_restriction: 0,
            joined_users: "{}",
            subscribed_users: "{}",
          }, {
            user_id: String(userMihika),
            event_name: "Funeral",
            event_description: "This is a funeral. Please attend to share your sorrows",
            price: "{0}",
            location: "Graveyard",
            tags: "{Music}",
            event_date: "2023-11-23",
            event_time: "11:30",
            max_capacity: 30,
            current_capacity: 0,
            seats: "{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}",
            age_restriction: 18,
            joined_users: "{}",
            subscribed_users: "{}",
          }, {
            user_id: String(userMihika),
            event_name: "Cruise Party",
            event_description: "This is a cruise party. be careful not to fall overboard.",
            price: "{32}",
            location: "Barangaroo",
            tags: "{\"Food & Drink\",Music}",
            event_date: "2023-11-25",
            event_time: "19:30",
            max_capacity: 300,
            current_capacity: 0,
            seats: "{-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32,-32}",
            age_restriction: 18,
            joined_users: "{}",
            subscribed_users: "{}",
          }, {
            user_id: String(userMihika),
            event_name: "Ben's Birthday",
            event_description: "Ben is turning 10! Come help celebrate his bday and have some cake!",
            price: "{0}",
            location: "166 John St, Cabramatta NSW 2166",
            tags: "{Other}",
            event_date: "2024-11-25",
            event_time: "17:30",
            max_capacity: 30,
            current_capacity: 0,
            seats: "{0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0}",
            age_restriction: 8,
            joined_users: "{}",
            subscribed_users: "{}",
          },
        ]),
      ])
    }
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Events', null, {});

  }
};