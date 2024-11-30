// Importing functions/libraries
const app = require('./app');
const database = require('./database/models');
const config = require('./config.json');
const { Tag } = require('./database/models');

const PORT = config.port; // Port number

/**
 * 
 * Description: Initialise the backend and link it to the database.
 * Also initialise the tags in the database if they aren't already.
 */
database.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        const tags = ['Music', 'Performing & Visual Arts', 'Seasonal', 'Health', 'Hobbies', 'Business', 'Food & Drink', 'Sports & Fitness', 'Other']
        console.log(`Server started on port ${PORT}`)

        Tag.findAll().then(tagData => {
            if (tagData.length === 0) {
                for (let tag of tags) {
                    Tag.create({
                        tag: tag
                    });
                }
            }
        }).catch(error => {
            console.error("Couldn't fetch the tag table:", error);
        });

    });
})