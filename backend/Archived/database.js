const { Pool } = require('pg');
const fs = require('fs');

//connecting information
const pool = new Pool({
  host: 'eventlite.c5ixtcpp7xbg.ap-southeast-2.rds.amazonaws.com',
  port: '5432',
  user: 'postgres',
  password: 'postgres',
  database: 'eventlite_db',
});


async function runQuery(query) {
  try {
    const client = await pool.connect(); //donncet database

    const result = await client.query(query);

    client.end(); //disconnect database

    return result.rows;

  } catch (error) {
    console.error('runQuery:', error);
    throw error;
  }
}


async function getUsersData() {
  try {
    const result = await runQuery('select * from users;');

    return result;

  } catch (error) {
    console.error('getUsersData:', error);
    throw error;
  }
}


async function addUserProfileImage(id, imagePath) {
  try {
    const imageFile = fs.readFileSync(imagePath);

    await runQuery({ text: 'INSERT INTO profile_images (user_id, image) VALUES ($1, $2)', values: [id, imageFile] });

  } catch (error) {
    console.error('addUserProfileImage:', error);
    throw error;
  }

}

async function getUserProfileImage(user_id) {
  try {
    const result = await runQuery({ text: 'SELECT image FROM profile_images WHERE user_id = $1', values: [user_id], })

    return result[0]['image']

  } catch (error) {
    console.error('getUserProfileImage:', error);
    throw error;
  }
}
/*
//demo in your function fetch the data 
runQuery("select * from Users;")
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.error('Error:', error);
});*/

/*
getUserProfileImage(1)
  .then((result) => {
    fs.writeFile('./aaa.png', result, (err) => {if (err) throw err;});
  })
  .catch((error) => {
    console.error('Error:', error);
});

//demo in your function fetch the data 
getUsersData()
  .then((result) => {
    console.log(result)
  })
  .catch((error) => {
    console.error('Error:', error);
});
*/

module.exports = {
  getUsersData,
  getUserProfileImage
};