require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const { verifyToken } = require('./utils/verifyToken');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/",function (req,res) {
    res.send("Hello user");
})
require('./routes/api/user')(app);


app.listen(3000,function(){
    console.log("App is up and running");
})