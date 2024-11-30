// Importing functions/libraries
const express = require('express');
const router = express.Router();
const { User } = require('../database/models');

/**
 * 
 * @param {String} token Indicate whether user is a student
 * Description: Given the user's token, remove the user from the database.
 * @returns {*}
 */
router.delete('/user/delete', async (req, res) => {
    try {
        const token = req.query.token;
        const user = User.findOne({
            where: {
                token: token
            }
        });

        // If the user does not exist in the database, return error
        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        };

        // Remove the user from the database.
        User.destroy({
            where: {
                token: token
            }
        })

        return res.json({})

    } catch (error) {
        console.error('Error. Cannot login user', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});


module.exports = router;