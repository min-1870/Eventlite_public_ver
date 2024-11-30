// Importing functions/libraries
const express = require('express');
const router = express.Router();
const { User, Event, Review, Replie } = require('../database/models');

/**
 * 
 * @param {String} token User's token
 * @param {Integer} eventId Event's id
 * @param {String} review A text of review
 * @param {Integer} star_rating An integer value between 1 and 5
 * Description: Given the parameters above, create a review
 * @returns {Integer} Return review's id
 */
router.post('/create', async (req, res) => {
    try {
        const token = req.header('token');

        const { eventId, review, star_rating } = req.body;

        // If the token is invalid, return error
        const user = await User.findOne({ where: { token: token } });
        if (!user) {
            return res.status(400).json({ error: "Cannot find token" })
        }

        // If the event id is invalid, return error
        const event = await Event.findOne({ where: { id: eventId } });
        if (!event) {
            return res.status(400).json({ error: 'Event does not exist' });
        }

        // If the star_rating is not between 1 and 5 inclusively, return error
        if (star_rating < 1 || star_rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' })
        }

        // Create review and return review's ID
        Review.create({
            userId: user.id,
            username: user.username,
            eventId: eventId,
            star: star_rating,
            review: review,
        }).then(result => {
            res.json({ review_id: result.id });
        })

    } catch (error) {
        console.error('Error. Cannot run /review/create.', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

/**
 * 
 * @param {Integer} eventId Event's id
 * Description: Calculate an average of all the star_rating scores
 * @returns {*}
 */
router.get('/average_star_rating', async (req, res) => {
    try {
        const { eventId } = req.query;

        // If there are no reviews for the event, return a score of 0
        const ratings = await Review.findAll({ where: { eventId: eventId } });
        if (ratings.length === 0) {
            res.json({ score: 0 });
            return;
        }

        // Calculate the average score
        let sum = 0;
        for (let count = 0; count < ratings.length; count++) {
            sum += ratings[count].star;
        }
        const score = parseFloat(sum) / parseFloat(ratings.length);
        res.json({ score: score });

    } catch (error) {
        console.error('Error. Cannot calculate average rating.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {Integer} eventId Event's id
 * Description: Return a list of reviews for an event
 * @returns {Array({reviews})} An array of reviews
 */
router.get('/list_review', async (req, res) => {
    try {
        const { eventId } = req.query;
        const reviews = await Review.findAll({ where: { eventId: eventId } });
        res.json({ reviews: reviews });
    } catch (error) {
        console.error('Error. Cannot list reviews.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {String} token User's token
 * @param {Integer} eventId Event's id
 * @param {Integer} reviewId Review's id
 * @param {String} reply The string representing the reply
 * Description: Given the above parameters, create a reply to a review
 * @returns {Integer} Reply's id
 */
router.post('/reply', async (req, res) => {
    try {
        const token = req.header('token');
        const { eventId, reviewId, reply } = req.body;

        // If the user does not have a valid token, return error
        const user = await User.findOne({ where: { token: token } });
        if (!user) {
            return res.status(400).json({ error: "Cannot find token" });
        }

        // If the review does not exist, return error
        const review = await Review.findAll({ where: { id: reviewId } });
        if (review.length === 0) {
            return res.status(400).json({ error: "Review not found" });
        }

        // If event does not exist, return error
        const event = await Event.findAll({ where: { id: eventId } });
        if (event.length === 0) {
            return res.status(400).json({ error: "Event not found" });
        }

        // Create reply
        Replie.create({
            reviewId: reviewId,
            reply: reply,
            eventId: eventId,
            username: user.username,
        }).then(result => {
            res.status(200).json({ replyId: result.id })
        })

    } catch (error) {
        console.error('Error. Cannot login user.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {Integer} eventId Event's id
 * Description: Return a list of replies for an event
 * @returns {Array({replies})} An array of replies for an event
 */
router.get('/list_replies', async (req, res) => {
    try {
        const { eventId } = req.query;

        const replies = await Replie.findAll({ where: { eventId: eventId } });

        res.json({ replies: replies });

    } catch (error) {
        console.error('Error. Cannot login user.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;