// Importing functions/libraries
const express = require('express');
const router = express.Router();
const { Event, User, Tag, Notification } = require('../database/models');
const qrcode = require('qrcode');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const secret = 'secret';

/**
 * 
 * @param {String} token User's token
 * Description: Given the token, we check whether or not the token is valid and their permissions 
 * @returns {*}
 */
async function authenticateUser(req, res, next) {
    const token = req.header("token");

    // Check if token is valid 
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        // Find the user 
        const user = await User.findOne({ where: { token: token } });

        // Check if user is valid 
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Decode the token 
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid token' });
    }
}

/**
 * 
 * @param {String} preference the recommendation preference 
 * @param {String} token the users token
 * Description: Provides a user with recommendations based on their preference of price, capacity or explore. It also takes into 
 * consideration the tags and age restriction of events to provide more specific recommendations. 
 * @returns {Object} recommended events 
 */
router.get('/event_recommended', authenticateUser, async (req, res) => {
    try {
        const { preference } = req.query;
        const token = req.header('token');

        // Find User 
        const user = await User.findOne({ where: { token: token } });

        // Retrieve the tags of the user
        const userTags = user.eventTags.map(tag => tag.toString());

        // Get the date of birth from the user object
        const dob = user.dob;

        // Calculate the user's age based on dob
        const currentDate = new Date();
        const birthDate = new Date(dob);
        let userAge = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
            userAge--;
        }

        // Recommendations based on price, capacity and explore, along with the tags and age_restriction filter applied 
        let recommendedEvents;
        if (preference === 'price') {
            recommendedEvents = await Event.findAll({
                where: {
                    // Check if the price array contains a 0 for a free event 
                    [Op.or]: [
                        { price: { [Op.contains]: ['0'] } },
                    ],

                    // Checks for an overlap of tags 
                    tags: { [Op.overlap]: userTags },

                    // Checks for age restriction 
                    age_restriction: {
                        [Op.or]: [
                            { [Op.eq]: null },
                            { [Op.gte]: userAge },
                        ],
                    },
                },
                limit: 5,
            });
        } else if (preference === 'capacity') {
            // Ordered by current capacity
            recommendedEvents = await Event.findAll({
                where: {
                    // Checks for an overlap of tags
                    tags: { [Op.overlap]: userTags },

                    // Checks for age restriction
                    age_restriction: {
                        [Op.or]: [
                            { [Op.eq]: null },
                            { [Op.gte]: userAge },
                        ],
                    },
                },

                // Arrange in descending order 
                order: [['current_capacity', 'DESC']],
                limit: 5,
            });
        } else if (preference === 'explore') {
            recommendedEvents = await Event.findAll({
                where: {
                    [Op.not]: {
                        // Check for events with no overlaping tags 
                        tags: { [Op.overlap]: userTags },

                        // Checks for age restriction
                        age_restriction: {
                            [Op.or]: [
                                { [Op.eq]: null },
                                { [Op.gte]: userAge },
                            ],
                        },
                    },
                },
                limit: 5,
            });
        } else {
            return res.status(400).json({ error: 'Invalid preference' });
        }

        // If there are no recommended events based on the users preference 
        if (recommendedEvents.length === 0) {
            if (preference === 'price') {
                return res.status(404).json({ message: 'No free events found with matching tags.' });
            } else if (preference === 'capacity') {
                return res.status(404).json({ message: 'No events found with matching tags.' });
            } else if (preference === 'explore') {
                return res.status(404).json({ message: 'No events found with new tags.' });
            }
        }

        res.status(200).json(recommendedEvents);
    } catch (error) {
        console.error('Error retrieving recommended events:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router; 