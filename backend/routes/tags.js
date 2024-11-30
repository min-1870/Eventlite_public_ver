// Importing functions/libraries
const express = require('express');
const router = express.Router();
const { Tag } = require('../database/models');

/**
 * 
 * @param {String} new_tag A string of a tag
 * Description: Create a new tag in the database
 * @returns {Integer} Return the tag's id
 */
router.post('/create', async (req, res) => {
    try {
        const new_tag = req.body.tag
        Tag.create({
            tag: new_tag
        }).then(result => {
            res.json({ tagId: result.id });
        });
    } catch (error) {
        console.error('Error. Cannot login user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;