/**
 * Seed file for generating dummy users.
 * Automatically generated by sequelize.
 * DO NOT MODIFY
 */
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Users', [
      {
        username: "ethanLammie",
        password: "$2a$10$YXbtKtZPCIA5OJ2bKruzoOimlHO5TpWddPHUoLBqh/BUZGSuOGMYu",
        firstName: "ethan",
        lastName: "lam",
        email: "niceguysu3@gmail.com",
        gender: "male",
        cardNumber: "4716063097921063",
        cvc: "445",
        expiryDate: "2027-09-08",
        dob: "1998-03-15",
        biography: "I am stuck in 3900",
        token: null,
        eventTags: "{}",
        student: true,
        eventsJoined: "{}",
        eventsHosted: "{}",
      }, {
        username: "Jason",
        password: "$2a$10$07.YwPkA.yA79075q/lgquc14SduUO8KGGNo.QpnYKUKWDoIs0zTS",
        firstName: "Jason",
        lastName: "White",
        email: "mihika0807@gmail.com",
        gender: "male",
        cardNumber: "4111111111111111",
        cvc: "873",
        expiryDate: "2026-09-08",
        dob: "1989-07-08",
        biography: "I want to explore new things",
        token: null,
        eventTags: "{}",
        student: true,
        eventsJoined: "{}",
        eventsHosted: "{}",
      }, {
        username: "Mihika",
        password: "$2a$10$YXUZrXW21oIIHnZQcfun5e54qXvoCE5VQYBDzJBPVvW5kP9ZbWqaK",
        firstName: "Mihika",
        lastName: "Goyal",
        email: "mihika0807@gmail.com",
        gender: "female",
        cardNumber: "4111111111111111",
        cvc: "873",
        expiryDate: "2025-07-08",
        dob: "2003-07-08",
        biography: "I want to go to events",
        token: null,
        eventTags: "{}",
        student: true,
        eventsJoined: "{}",
        eventsHosted: "{}",
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
