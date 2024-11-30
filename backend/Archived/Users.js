// Create a table containing information about each user.
module.exports = (sequelize, Datatypes) => {
    const Users = sequelize.define("Users", {
        username: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        password: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        email: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        date_of_birth: {
            type: Datatypes.DATEONLY,
            allowNull: false,
        },
        first_name: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        last_name: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        gender: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        card_number: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        expiry_date: {
            type: Datatypes.STRING,
            allowNull: false,
        },
        cvc: {
            type: Datatypes.STRING,
            allowNull: false
        },
        biography: {
            type: Datatypes.STRING,
            allowNull: false
        },
        token: {
            type: Datatypes.STRING,
            allowNull: false
        }, 
    },{
        // Other model options go here
        timestamps: false, // Existing table does not have createdAt or updatedAt
    })
    return Users;
}
