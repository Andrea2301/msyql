const mysql = require('mysql2');

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'expertsoft'
});

db.connect(err =>{
    if(err){
    console.error("Error connecting to MYSQL", err);
    return;
    }
    console.log("Connected to the DB");
});

module.exports = db;