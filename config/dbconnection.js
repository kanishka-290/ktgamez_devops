require('dotenv').config()
const mysql2 = require("mysql2/promise");
// create the connection to database
module.exports = function sqlConnect () {
    const conn = mysql2.createConnection({
        host: process.env.HOST,
        user: "root",
        password:process.env.PASSWORD,
        database: process.env.DB_NAME,
    });
    if(conn){
        console.log("Connected to database")
    return conn;
    }else{
        console.log("Database connection failed.")
    }
}

