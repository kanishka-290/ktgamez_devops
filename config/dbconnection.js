require('dotenv').config()
const mysql2 = require("mysql2/promise");
// create the connection to database
module.exports = function sqlConnect () {
    const conn = mysql2.createConnection({
        host: process.env.HOST,
        user: process.env.USER_NAME,
        password:process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port:process.env.DB_PORT
    });
    if(conn){
        //console.log("Connected to database")
    return conn;
    }else{
        console.log("Database connection failed.")
    }
}

