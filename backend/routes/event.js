// Importing functions/libraries
const express = require('express');
const router = express.Router();
const { Event, User, Tag, Notification } = require('../database/models');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');

const secret = 'A SAMPLE SECRET'; // Secret for the token generator

// sendgrid API
const sendgridApiKey = 'A SAMPLE SENDGRID API KEY';
sgMail.setApiKey(sendgridApiKey);

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
        // Find user 
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
 * @param {Integer} id User's id
 * Description: Given the event id, all the seats are shown 
 * @returns {Array{Integer}} array of seats 
 */
router.get('/event_seats_all', authenticateUser, async (req, res) => {
    const id = req.query.id;

    // Find event
    const event = await Event.findOne({ where: { id: id } });

    let seats = event.seats.map((val, idx) => {
        let price = parseInt(val) < 0 ? val * -1 : 0;
        let status = parseInt(val) <= 0 ? 'Available' : 'Not available';
        return { id: idx + 1, price: price, status: status };
    });

    res.status(200).json(seats);
});

/**
 * 
 * @param {*} 
 * Description: Find all the events that exist 
 * @returns {Array({events})} array of events  
 */
router.get('/event_all', async (req, res) => {
    const query = await Event.findAll();
    res.status(200).json(query);
});

/**
 * 
 * @param {*} 
 * Description: Find all the tags that exist 
 * @returns {Array({tags})} array of events  
 */
router.get('/event_tags_all', async (req, res) => {
    const query = await Tag.findAll();
    res.status(200).json(query);
});

/**
 * 
 * @param {Integer} id id of the event
 * @param {Array{Integer}} selectedSeats array of seats 
 * @param {String} token token of the user 
 * Description: Join an event given its id and select a seat. Add the user id to joined users and event id to eventsJoined. Update the tags 
 * of the user and send the user an email for joining. 
 * @returns {String} success message of joining an event  
 */
router.put('/event_join', authenticateUser, async (req, res) => {
    const { id, selectedSeats } = req.body;
    const token = req.header('token');

    try {
        // Find event
        const event = await Event.findOne({ where: { id: id } });

        // Find user
        const user = await User.findOne({ where: { token: token } });

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

        if (userAge < event.age_restriction) {
            return res.status(400).json({ error: 'You do not meet the age restriction for this event.' });
        }

        // Get seats 
        const seats = [...event.seats]

        // Event or user does not exist in the database
        if (!event || !user) {
            console.log(event);
            return res.status(400).json({ error: 'Wrong input' });
        }

        // Check if the event has reached its maximum capacity
        if (event.current_capacity >= event.max_capacity) {
            return res.status(400).json({ error: 'Event is already at maximum capacity' });
        }

        // Increment the current capacity and save the event
        event.current_capacity += selectedSeats.length;

        // Create joined users array if it does not exist already 
        if (!Array.isArray(event.joined_users)) {
            event.joined_users = [];
        }

        const user_id = user.id;

        // Check if the user has already joined the event
        if (event.joined_users.map(ele => Number(ele)).includes(Number(user_id))) {
            return res.status(400).json({ error: 'The user has already joined' });
        }

        // Save the user id to the joined_users array and update the event
        await event.set('joined_users', [...event.joined_users, user.id]);
        await event.save();

        // Save the user id to the seats
        Object.values(selectedSeats).forEach(location => {
            seats[Number(location) - 1] = Number(user.id);
        });

        // Update the seats in the event 
        await event.set('seats', seats);
        await event.save();

        // Create eventsJoined array if it does not exist already 
        if (!user.eventsJoined) {
            user.eventsJoined = [];
        }

        // Add the event ID to the user's eventsJoined array 
        let userEventsJoined = [...user.eventsJoined]
        userEventsJoined.push(id)

        // Update in the event
        await user.set('eventsJoined', userEventsJoined);
        await user.save();

        // Update user's eventTags array
        if (!Array.isArray(user.eventTags)) {
            user.eventTags = [];
        }

        // Get the existing tags from the user object
        const existingTags = user.eventTags;

        // Get the tags of the event that are not already in the user's eventTags array
        const newTags = event.tags.filter(tag => !existingTags.includes(tag));

        const updatedTags = [...existingTags, ...newTags];

        // Update the eventTags array for the user
        await user.set('eventTags', updatedTags);
        await user.save();

        // Send email notification to the user who joined the event
        const subject = `Event ${event.event_name} - You Have Joined`;
        const body = `Thank you for joining the event ${event.event_name}. We look forward to seeing you there!`;

        const msg = {
            to: user.email,
            from: 'mihika0807@gmail.com',
            subject: subject,
            text: body,
        };

        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error('Error sending email:', error);
        }

        res.status(200).json({ message: 'Confirmed the input, waiting for payment' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {Integer} id id of the event
 * @param {String} token token of the user 
 * Description: Subscribe to an event given its id without actually joining it. Add the user id to subscribed users and update the tags 
 * of the user. 
 * @returns {String} success message of joining an event  
 */
router.put('/event_subscribe', authenticateUser, async (req, res) => {
    const { id } = req.body;
    const token = req.header('token');

    try {
        // Find event
        const event = await Event.findOne({ where: { id: id } });

        // Find user
        const user = await User.findOne({ where: { token: token } });

        // Event or user does not exist in the database
        if (!event || !user) {
            return res.status(400).json({ error: 'Wrong input' });
        }

        const user_id = user.id;

        // Create subscribed users array if it does not already exist 
        if (!Array.isArray(event.subscribed_users)) {
            event.subscribed_users = [];
        }

        // Check if the user has already subscribed to the event
        if (event.subscribed_users.map(ele => Number(ele)).includes(Number(user_id))) {
            return res.status(400).json({ error: 'The user has already subscribed' });
        }

        // Update the subscribed users 
        await event.set('subscribed_users', [...event.subscribed_users, user.id]);
        await event.save();

        // Update the eventTags array for the user
        await user.set('eventTags', [...user.eventTags, ...event.tags]);
        await user.save();

        res.status(200).json({ message: 'Subscribed to the event' });
    } catch (error) {
        console.error('Error subscribing to event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {String} event_name name of the event
 * @param {String} event_description description of the event 
 * @param {Array{String}} price prices of the tickets 
 * @param {String} location location of the event 
 * @param {Array{String}} tags tags of the event 
 * @param {DateOnly} event_date date of the event 
 * @param {Time} event_ime time of the event
 * @param {Integer} max_capacity maximum capacity of the event 
 * @param {Integer} age_restriction  age restriction of the event
 * @param {String} token token of the user 
 * Description: Create an event by providing all the information required. Add the event to the eventsHosted field of the user. 
 * @returns {String} success message of joining an event 
 * @returns {Object} event object 
 */
router.post('/event_create', authenticateUser, async (req, res) => {
    const { event_name, event_description, price, location, tags, event_date, event_time, max_capacity, age_restriction } = req.body;

    // Check for duplicate tags
    const uniqueTags = [...new Set(tags)];
    if (uniqueTags.length !== tags.length) {
        return res.status(400).json({ error: 'Duplicate tags found' });
    }

    const token = req.header('token');

    // Find the user 
    const user = await User.findOne({ where: { token: token } });
    const user_id = user.id;
    const joined_users = [];
    const subscribed_users = [];

    try {
        // Check if all event_tags exist in the Tag table
        const event_tags = await Tag.findAll({ where: { tag: tags } });
        const existingTags = event_tags.map(tag => tag.tag);

        // Error message for the tags that do not exist 
        const nonExistentTags = tags.filter(tag => !existingTags.includes(tag));
        if (nonExistentTags.length > 0) {
            return res.status(400).json({ error: `Tags do not exist: ${nonExistentTags.join(', ')}` });
        }

        // Calculate the distributed prices
        const distributedPrices = distributePricesEvenly(price, max_capacity);

        let newEventID = 0

        // Create an event object
        const event = await Event.create({
            user_id: user_id,
            event_name: event_name,
            event_description: event_description,
            price: price,
            location: location,
            tags: tags,
            event_date: event_date,
            event_time: event_time,
            max_capacity: max_capacity,
            current_capacity: 0,
            seats: distributedPrices,
            age_restriction: age_restriction,
            joined_users: joined_users,
            subscribed_users: subscribed_users
        }).then(result => {
            newEventID = result.id
        });

        // Create eventsHosted if the array does not already exist 
        if (user.eventsHosted === undefined) {
            user.eventsHosted = [];
        }

        // Add the event ID to the user's eventsHosted array
        let userEventsHosted = [...user.eventsHosted]
        userEventsHosted.push(newEventID)

        // Update the table
        await user.set('eventsHosted', userEventsHosted);
        await user.save();

        return res.status(200).json({ message: 'SUCCESS', event });
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {Array{Integer}} prices prices of the seats 
 * @param {Integer} maxCapacity maximum capacity of the event 
 * Description: Distribute the prices of the tickets evenly across the number of seats 
 * @returns {Array{Integer}} array of distributed prices  
 */
function distributePricesEvenly(prices, maxCapacity) {
    const distributedPrices = [];
    const numPrices = prices.length;
    const pricePerSeat = Math.floor(maxCapacity / numPrices);
    const remainingSeats = maxCapacity % numPrices;

    for (let i = 0; i < numPrices; i++) {
        const price = -Math.abs(prices[i]);
        const numSeats = i < remainingSeats ? pricePerSeat + 1 : pricePerSeat;
        distributedPrices.push(...new Array(numSeats).fill(price));
    }

    return distributedPrices;
}

/**
 * 
 * @param {Integer} id id of the event 
 * @param {String} event_name name of the event
 * @param {String} event_description description of the event 
 * @param {Array{String}} price prices of the tickets 
 * @param {String} location location of the event 
 * @param {Array{String}} tags tags of the event 
 * @param {DateOnly} event_date date of the event 
 * @param {Time} event_ime time of the event
 * @param {Integer} max_capacity maximum capacity of the event 
 * @param {Integer} age_restriction  age restriction of the event
 * @param {String} token token of the user 
 * Description: Allow the user to edit the fields of the event. This well send any joined users an email about the updated fields. 
 * @returns {String} success message 
 */
router.put('/event_edit', authenticateUser, async (req, res) => {
    const { id, event_name, event_description, price, location, tags, event_date, event_time, max_capacity, age_restriction } = req.body;

    try {
        // Find event
        const event = await Event.findOne({ where: { id: id } });

        // Event does not exist in the database
        if (!event) {
            return res.status(400).json({ error: 'Event does not exist.' });
        }

        const token = req.header('token');

        // Find user
        const user = await User.findOne({ where: { token: token } });

        // User does not exist in the database
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if the user is the owner of the event
        if (Number(event.user_id) !== user.id) {
            return res.status(403).json({ error: 'Forbidden: You are not the owner of this event.' });
        }

        // Get the current event details before updating
        const oldEvent = {
            event_name: event.event_name,
            event_description: event.event_description,
            price: event.price,
            location: event.location,
            tags: event.tags,
            event_date: event.event_date,
            event_time: event.event_time,
            max_capacity: event.max_capacity,
            age_restriction: event.age_restriction
        };

        // Update the event properties
        event.event_name = event_name;
        event.event_description = event_description;
        event.price = price;
        event.location = location;
        event.tags = tags;
        event.event_date = event_date;
        event.event_time = event_time;
        event.max_capacity = max_capacity;
        event.age_restriction = age_restriction;

        // Save the changes to the database
        await event.save();

        // Send email notification to the users who have joined the event
        const joinedUserIds = event.joined_users;
        const subject = `Event ${oldEvent.event_name} Updated`;
        const emailContent = [];

        let notification = "";

        // Compare old and new event details and add the changed fields to the email content
        if (oldEvent.event_name !== event_name && event_name !== undefined) {
            emailContent.push(`Event Name: ${oldEvent.event_name} -> ${event_name}`);
            notification += `Event name changed to: ${event_name}; `;
        } else if (event_name == undefined) {
            emailContent.push(`Event Name: ${oldEvent.event_name} -> unchanged`);
        }

        if (oldEvent.event_description !== event_description && event_description !== undefined) {
            emailContent.push(`Event Description: ${oldEvent.event_description} -> ${event_description}`);
            notification += "Event description changed; "
        } else if (event_description == undefined) {
            emailContent.push(`Event Description: ${oldEvent.event_description} -> unchanged`);
        }

        if (oldEvent.price !== price && price !== undefined) {
            emailContent.push(`Price: ${oldEvent.price} -> ${price}`);
            notification += "Prices changed; "
        } else if (price == undefined) {
            emailContent.push(`Event Price: ${oldEvent.price} -> unchanged`);
        }

        if (oldEvent.location !== location && location !== undefined) {
            emailContent.push(`Location: ${oldEvent.location} -> ${location}`);
            notification += `Location changed to ${location}; `
        } else if (location == undefined) {
            emailContent.push(`Location: ${oldEvent.location} -> unchanged`);
        }

        if (oldEvent.tags !== tags && tags !== undefined) {
            emailContent.push(`Tags: ${oldEvent.tags} -> ${tags}}`);
            notification += `Event tags changed to ${tags}; `
        } else if (tags == undefined) {
            emailContent.push(`Tags: ${oldEvent.tags} -> unchanged`);
        }

        if (oldEvent.event_date !== event_date && event_date !== undefined) {
            emailContent.push(`Event Date: ${oldEvent.event_date} -> ${event_date}`);
            notification += `Event date changed to ${event_date}; `
        } else if (event_date == undefined) {
            emailContent.push(`Event Date: ${oldEvent.event_date} -> unchanged`);
        }

        if (oldEvent.event_time !== event_time && event_time !== undefined) {
            emailContent.push(`Event Time: ${oldEvent.event_time} -> ${event_time}`);
            notification += `Event time changed to ${event_time}; `
        } else if (event_time == undefined) {
            emailContent.push(`Event Time: ${oldEvent.event_time} -> unchanged`);
        }

        if (oldEvent.max_capacity !== max_capacity && max_capacity !== undefined) {
            emailContent.push(`Maximum Capacity: ${oldEvent.max_capacity} -> ${max_capacity}`);
            notification += `Max capacity changed to ${max_capacity}; `
        } else if (max_capacity == undefined) {
            emailContent.push(`Maximum Capacity: ${oldEvent.max_capacity} -> unchanged`);
        }

        if (oldEvent.age_restriction !== age_restriction && age_restriction !== undefined) {
            emailContent.push(`Age Restriction: ${oldEvent.age_restriction} -> ${age_restriction}`);
            notification += `Age restriction changed to ${age_restriction}; `
        } else if (age_restriction == undefined) {
            emailContent.push(`Age Restriction: ${oldEvent.age_restriction} -> unchanged`);
        }

        // Send email with the updated information 
        if (emailContent.length > 0) {
            const body = `The event ${oldEvent.event_name} has been updated with the following changes:\n\n` +
                emailContent.join('\n') + `\n\nCheck the website for more details.`;

            joinedUserIds.forEach(async (userId) => {
                const user = await User.findOne({ where: { id: userId } });
                if (user && user.email) {
                    const msg = {
                        to: user.email,
                        from: 'mihika0807@gmail.com',
                        subject: subject,
                        text: body,
                    };

                    try {
                        await sgMail.send(msg);
                    } catch (error) {
                        console.error('Error sending email:', error);
                    }
                }
            });
        }
        if (notification !== "") {
            // Create notification in database
            Notification.create({
                eventId: id,
                notification: notification
            });
        }

        return res.status(200).json({ message: 'Event updated successfully' });
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {Integer} id id of the event 
 * Description: Allows the user to view the event 
 * @returns {Object} event object 
 */
router.get('/event_view', async (req, res) => {
    const id = req.query.id;

    try {
        // Find event
        const event = await Event.findOne({ where: { id: id } });

        // Event does not exist in the database
        if (!event) {
            return res.status(400).json({ error: 'Event does not exist.' });
        }

        // Convert the price and tags fields to arrays
        const formattedEvent = {
            ...event.toJSON(),
            price: event.price.map((price) => parseFloat(price)),
            seats: event.seats.map((seats) => parseFloat(seats)),
        };

        res.status(200).json(formattedEvent);
    } catch (error) {
        console.error('Error retrieving event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {Integer} id id of the event 
 * Description: Allows the host to delete the event and the joined user are sent an email to inform them of this. 
 * @returns {String} success message 
 */
router.delete('/event_delete', authenticateUser, async (req, res) => {
    const { id } = req.body;
    const token = req.header('token');
    try {
        // Find event
        const event = await Event.findOne({ where: { id: id } });

        // Event does not exist in the database
        if (!event) {
            return res.status(400).json({ error: 'Event does not exist.' });
        }

        // Find user
        const user = await User.findOne({ where: { token: token } });

        // User does not exist in the database
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Check if the user is the owner of the event
        if (Number(event.user_id) !== user.id) {
            return res.status(403).json({ error: 'Forbidden: You are not the owner of this event.' });
        }

        // Get the event details before deleting
        const deletedEvent = {
            event_name: event.event_name,
            event_description: event.event_description,
        };

        // Get the list of joined users
        const joinedUsers = event.joined_users;

        // Store the joined users in a separate variable
        const joinedUserIds = [...joinedUsers];

        // Delete the event from the database
        await event.destroy();

        // Remove the event ID from the eventsJoined array of all users who had joined the event
        for (const userId of joinedUserIds) {
            const user = await User.findOne({ where: { id: userId } });
            if (user) {
                user.eventsJoined = user.eventsJoined.filter((eventId) => eventId !== parseInt(id));
                await user.save();
            }
        }

        // Send email notification to the users who have joined the event
        const subject = `Event ${deletedEvent.event_name} Updated`;
        const body = `The event ${deletedEvent.event_name} has been cancelled.` +
            `\n\nWe apologize for any inconvenience.`;

        joinedUserIds.forEach(async (userId) => {
            const user = await User.findOne({ where: { id: userId } });
            if (user && user.email) {
                const msg = {
                    to: user.email,
                    from: 'mihika0807@gmail.com',
                    subject: subject,
                    text: body,
                };

                try {
                    await sgMail.send(msg);
                } catch (error) {
                    console.error('Error sending email:', error);
                }
            }
        });

        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {Integer} eventId id of the event 
 * Description: Lists the notifications 
 * @returns {String} notifications  
 */
router.get('/list/notifications', async (req, res) => {
    try {
        const { eventId } = req.query;

        // Find the event 
        const notifications = await Notification.findAll({ where: { eventId: eventId } });

        res.json({ notifications: notifications });
    } catch (error) {
        console.error('Error. Cannot list notifications.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * 
 * @param {String} token token of the user 
 * Description: User cancels the event and gets a refund. The database is also updated as the eventId is removed from the user and the 
 * userId is removed from the event database
 * @returns {Integer} sum of refund 
 */
router.put('/user/cancel_event', async (req, res) => {
    try {
        const token = req.header('token');

        // Find the user 
        const user = await User.findOne({ where: { token: token } })

        // Check if the user does not exist in the database 
        if (!user) {
            return res.status(401).json({ error: "Cannot find token" })
        }

        const eventId = req.body.eventId;

        // Find the event 
        const event = await Event.findOne({ where: { id: eventId } })

        // Check if the event does not exist in the database 
        if (!event) {
            return res.status(400).json({ error: 'Event does not exist.' });
        }

        // If the event's joined_users array does not contain the user's ID, throw an error.
        if (!event.joined_users.map(input => Number(input)).includes(user.id)) {
            return res.status(400).json({ error: "User has not joined event" });
        }

        // If the user's eventsJoined array does not contain the event's ID, throw an error
        if (!user.eventsJoined.map(input => Number(input)).includes(event.id)) {
            return res.status(400).json({ error: "Event not found in user's account" });
        }

        let userSeatCount = event.current_capacity;
        for (let seat of event.seats) {
            if (seat === user.id) {
                userSeatCount--;
            }
        }

        // Remove user's Id from the event's joined_users array
        const newJoinedUsersArray = event.joined_users.filter(userId => userId != user.id);

        // Update database
        await event.update({ joined_users: newJoinedUsersArray, current_capacity: userSeatCount });
        await event.save();

        // Remove the eventId from the user's eventsJoined array
        const newEventsJoinedArray = user.eventsJoined.filter(eventId => eventId != event.id)

        // Update database
        await user.update({ eventsJoined: newEventsJoinedArray });
        await user.save();

        // Calculate the price for each seat.
        const distributedPrices = distributePricesEvenly(event.price, event.max_capacity);

        // Loop through the event's seat array to grab the occurrences of userId and find the refund amount.
        let sumOfRefund = 0;
        for (let index = 0; index < event.seats.length; index++) {
            if (event.seats[index] === Number(user.id)) {
                sumOfRefund += distributedPrices[index] * -1;
            }
        }

        // If student, reduce refund by 15%
        if (user.student === true) {
            sumOfRefund = sumOfRefund * 0.85;
        }

        // Replace the userIds from the events.seat array with the original price numbers.
        const newEventsSeatArray = event.seats.map((element, index) => Number(element) === user.id ? distributedPrices[index] : element);

        // Update database 
        await event.update({ seats: newEventsSeatArray });
        await event.save();
        return res.json({ sumOfRefund: sumOfRefund });
    } catch (error) {
        console.error('Error. User cannot cancel event.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;