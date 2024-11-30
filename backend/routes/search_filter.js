// Importing functions/libraries
const express = require('express');
const router = express.Router();
const { Event } = require('../database/models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

/**
 * 
 * @param {String} search The search phrase
 * @param {String} tags A list of tags
 * @param {String} sortTime Sorting for the event dates. Can either be "ASC" or "DES"
 * Description: Given a search phrase, list of tags, and a sorting phrase, return a list of events relating to the search, filtered by the given tags and sorted based on the sortTime variable.
 * @returns {String} List of events relating to search parameters
 */
router.get('/', async (req, res) => {
    try {
        const search = req.query.search;

        // Return error when you search phrase is given
        if (search === undefined) {
            return res.status(400).json({ error: 'Need search' });
        }

        let tags = req.query.tags;
        // Return error when no tag array is given
        if (tags === undefined) {
            return res.status(400).json({ error: 'Need tag' });
        }

        tags = tags.split(","); // Split the array into another array where the tags are separated

        const sortTime = req.query.sortTime;

        // Searches all events similar to search phrase and filters out based on tags.
        const result = await Event.findAll({
            where: {
                [Op.or]: [
                    { event_name: { [Op.iLike]: `%${search}%` } },
                    { event_description: { [Op.iLike]: `%${search}%` } },
                    { location: { [Op.iLike]: `%${search}%` } },
                ],

            },
        });

        // If search phrase not found, return error
        if (result.length === 0) {
            return res.status(404).json({ error: 'Cannot find search phrase' });
        }

        // If there are no tags...
        if (tags[0] === "") {

            // If there is a sortTime given...
            if (sortTime !== undefined) {
                // Return the search list in ascending order of event date
                if (sortTime === "ASC") {
                    result.sort((a, b) => {
                        let da = new Date(a.event_date), db = new Date(b.event_date);
                        return da - db;
                    });

                    return res.json(result);

                } else if (sortTime === "DES") {
                    // Return the search list in descending order of event date
                    result.sort((a, b) => {
                        let da = new Date(a.event_date), db = new Date(b.event_date);
                        return db - da;
                    });

                }
                return res.json(result);
            }

            // If there are no tags...
        } else {
            // Filter the search list using the tags
            let filtered_result = [];
            for (let event of result) {
                for (let tag of event.tags) {
                    if (tags.includes(tag)) {
                        filtered_result.push(event)
                        break;
                    }
                }
            }
            if (filtered_result.length === 0) {
                return res.status(404).json({ error: 'Cannot find searches with tags' })
            }

            // If a sort is given, sort event date either in ascending order or descending order.
            if (sortTime !== undefined) {
                if (sortTime === "ASC") {
                    filtered_result.sort((a, b) => {
                        let da = new Date(a.event_date), db = new Date(b.event_date);
                        return da - db;
                    });
                } else if (sortTime === "DES") {
                    filtered_result.sort((a, b) => {
                        let da = new Date(a.event_date), db = new Date(b.event_date);
                        return db - da;
                    });
                }
            }

            return res.json(filtered_result);
        }
    } catch (error) {
        console.error('Error. Search function error', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

module.exports = router;