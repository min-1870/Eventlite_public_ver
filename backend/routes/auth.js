// Importing functions/libraries
const express = require('express');
const router = express.Router();
const { User, Event } = require('../database/models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const validator = require('validator');
const moment = require('moment');
const { Op } = require('sequelize');

const secret = 'secret'; // Value for the jsonWebToken generator

/**
 * 
 * @param {String} username User's username
 * @param {String} password User's password
 * Description: Given the username and password, return their token
 * @returns {String} token
 */
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the user in the database
        const user = await User.findOne({ where: { username: username } });

        // If the user does not exist in the database, return error
        if (!user) {
            return res.status(401).json({ error: "User does not exist" });
        };

        // If the user is already logged in, return error
        if (user.token) {
            return res.status(400).json({ error: "User already logged in" });
        }

        // Compare the given password
        bcrypt.compare(password, user.password).then((match) => {
            // If the given password is wrong, return error
            if (!match) {
                return res.status(400).json({ error: "Wrong username or password" });
            }

            // Generate token after logging in
            const token = sign({ username: user.username, id: user.id }, secret)
            user.update({ token: token }, {
                where: {
                    username: username
                }
            });

            // Successfully logged in.
            return res.json(token);
        });
    } catch (error) {
        console.error('Error. Cannot login user', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

/**
 * 
 * @param {String} username User's username
 * @param {String} password User's password
 * @param {String} email User's email
 * @param {Date} dob User's date of birth
 * @param {String} firstName User's first name
 * @param {String} lastName User's last name
 * @param {String} gender User's gender
 * @param {String} cardNumber User's credit card number
 * @param {Date} expiryDate User's credit card expiry date
 * @param {String} cvc User's credit card cvc
 * @param {String} biography User's biography
 * @param {Boolean} student Indicate whether user is a student
 * Description: Given the above parameters, create an account and profile for the user.
 * @returns {String} token
 */
router.post('/register', async (req, res) => {

    try {
        const { username, password, email, dob, firstName, lastName, gender, cardNumber, expiryDate, cvc, biography, student } = req.body;
        if (username.length < 5) {
            return res.status(400).json({ error: "Username too short" });
        }

        // If the username already exists, return error.
        const user_exist = await User.findOne({ where: { username: username } });
        if (user_exist) {
            return res.status(400).json({ error: "Username already used" });
        }

        // Password must be 6 characters or longer
        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be longer 6 characters or longer' });
        }

        // Validates email address.
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Email invalid' });
        }

        // If the email is already used, return error.
        const email_exist = await User.findOne({ where: { email: email } });
        if (email_exist) {
            return res.status(400).json({ error: "Email already used" });
        }

        // If the credit card fails, return error.
        if (!validator.isCreditCard(cardNumber)) {
            return res.status(400).json({ error: "Credit card invalid" });
        }

        // Generate token and return it
        const token = sign({ username: username }, secret)

        // Hash the password using bcrypt
        bcrypt.hash(password, 10).then((hash) => {
            // Create the user in the database
            User.create({
                username: username,
                password: hash,
                email: email,
                dob: moment(dob),
                firstName: firstName,
                lastName: lastName,
                gender: gender,
                cardNumber: cardNumber,
                expiryDate: moment(expiryDate),
                cvc: cvc,
                biography: biography,
                token: token,
                eventTags: [],
                student: student,
                eventsJoined: [],
                eventsHosted: [],
            });
        });
        return res.json(token);
    } catch (error) {
        console.error('Error. Cannot register user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {String} token User's token
 * Description: Given the user's token, log the user out of the website
 * @returns {*}
 */
router.post('/logout', async (req, res) => {
    try {
        const token = req.header('token');

        // If the token is invalid, return error
        const user = await User.findOne({ where: { token: token } });
        if (!user) {
            return res.status(401).json({ error: "Cannot find token" })
        }

        // Set the user's token to null
        user.token = null;

        await user.save();

        return res.json({});
    } catch (error) {
        console.error('Error. Cannot logout user', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {String} token User's token
 * Description: Given the user's token, return the user's details.
 * @returns {String} User's details
 */
router.get('/user/profile', async (req, res) => {
    try {
        const token = req.header('token');

        // If the token is invalid, return error
        const user = await User.findOne({ where: { token: token } });
        if (!user) {
            return res.status(401).json({ error: "Cannot find token" })
        }

        return res.json(user);
    } catch (error) {
        console.error('Error. Cannot get user details', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


/**
 * 
 * @param {String} username User's username
 * @param {String} password User's password
 * @param {String} email User's email
 * @param {Date} dob User's date of birth
 * @param {String} firstName User's first name
 * @param {String} lastName User's last name
 * @param {String} gender User's gender
 * @param {String} cardNumber User's credit card number
 * @param {Date} expiryDate User's credit card expiry date
 * @param {String} cvc User's credit card cvc
 * @param {String} biography User's biography
 * @param {Boolean} student Indicate whether user is a student
 * Description: Given the above parameters, edit the user's account details.
 * @returns {*}
 */
router.put('/user/edit', async (req, res) => {
    try {
        const token = req.header('token');

        // If the token is invalid, return error
        const user = await User.findOne({ where: { token: token } });
        if (!user) {
            return res.status(401).json({ error: "Cannot find token" })
        }

        const { username, password, email, dob, firstName, lastName, gender, cardNumber, expiryDate, cvc, biography, student } = req.body;

        // If a new username is passed...
        if (username !== undefined) {
            // If username is too short, return error
            if (username.length < 5) {
                return res.status(400).json({ error: "Username too short" });
            }

            // If the username already exists, return error.
            const user_exist = await User.findOne({ where: { username: username } });
            if (user_exist) {
                return res.status(400).json({ error: "Username already used" });
            }
        }

        let hashed_password;
        // If a new password is passed...
        if (password !== undefined) {
            // Password must be 6 characters or longer
            if (password.length < 6) {
                return res.status(400).json({ error: 'Password must be longer 6 characters or longer' });
            }
            hashed_password = await bcrypt.hash(password, 10);
        }

        // If a new email is passed...
        if (email !== undefined) {
            // Validates email address.
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: 'Email invalid' });
            }

            // If the email is already used, return error.
            const email_exist = await User.findOne({ where: { email: email } });
            if (email_exist) {
                return res.status(400).json({ error: "Email already used" });
            }
        }

        // If a new credit card number is passed...
        if (cardNumber !== undefined) {
            // If the credit card fails, return error.
            if (!validator.isCreditCard(cardNumber)) {
                return res.status(400).json({ error: "Credit card invalid" });
            }
        }

        // Update the user's details
        user.update({
            username: username,
            password: hashed_password,
            email: email,
            dob: moment(dob),
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            cardNumber: cardNumber,
            expiryDate: moment(expiryDate),
            cvc: cvc,
            biography: biography,
            student: student,
        }, {
            where: {
                token: token
            }
        })

        user.save();

        return res.json({});

    } catch (error) {
        console.error('Error. Cannot edit user.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {String} token User's token
 * Description: Given the user's token, return a list of events that the user joined
 * @returns {String} List of events the user joined
 */
router.get('/listEventsJoined', async (req, res) => {
    try {

        const token = req.header('token');

        // If the token is invalid, return error
        const user = await User.findOne({ where: { token: token } });
        if (!user) {
            return res.status(401).json({ error: "Cannot find token" })
        }

        // If eventsJoined array is empty, return empty array.
        if (user.eventsJoined.length === 0) {
            return res.json([]);
        }

        const events = await Event.findAll({
            where: {
                id: {
                    [Op.or]: user.eventsJoined
                }
            }
        });

        return res.json(events);

    } catch (error) {
        console.error('Error. Cannot list events joined.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {String} token User's token
 * Description: Given the user's token, return a list of events that the user hosted.
 * @returns {String} List of events the user hosted
 */
router.get('/listEventsHosted', async (req, res) => {
    try {
        const token = req.header('token');

        const user = await User.findOne({ where: { token: token } });
        if (!user) {
            return res.status(401).json({ error: "Cannot find token" })
        }

        // If eventsHosted array is empty, return empty array.
        if (user.eventsHosted.length === 0) {
            return res.json([]);
        }

        const events = await Event.findAll({
            where: {
                id: {
                    [Op.or]: user.eventsHosted
                }
            }
        });

        return res.json(events)

    } catch (error) {
        console.error('Error. Cannot list events hosted.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;