/**
 * Event table for the database for storing event details.
 * This table was not generated using sequelize.
 * DO NOT MODIFY
 */
module.exports = (sequelize, Datatypes) => {
    const Event = sequelize.define("Event", {
        user_id: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        event_name: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        event_description: {
            type: Datatypes.TEXT,
            allowNull: true,
        },
        price: {
            type: Datatypes.ARRAY(Datatypes.STRING),
            allowNull: true,
        },
        location: {
            type: Datatypes.STRING,
            allowNull: true,
        },
        tags: {
            type: Datatypes.ARRAY(Datatypes.STRING),
            allowNull: true,
        },
        event_date: {
            type: Datatypes.DATEONLY,
            allowNull: true,
        },
        event_time: {
            type: Datatypes.TIME,
            allowNull: true,
        },
        max_capacity: {
            type: Datatypes.INTEGER,
            allowNull: true,
        },
        current_capacity: {
            type: Datatypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
        seats: {
            type: Datatypes.ARRAY(Datatypes.INTEGER),
        },
        age_restriction: {
            type: Datatypes.INTEGER,
            defaultValue: 0,
            allowNull: true,
        },
        joined_users: {
            type: Datatypes.ARRAY(Datatypes.INTEGER),
            defaultValue: [],
            allowNull: true,
        },
        subscribed_users: {
            type: Datatypes.ARRAY(Datatypes.INTEGER),
            defaultValue: [],
            allowNull: true,
        },
    }, {
        timestamps: false,
        modelName: 'Event',
    });

    Event.associate = (models) => {
    };

    return Event;
}