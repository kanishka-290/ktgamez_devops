require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');
const app = express();
const store = require("store2")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname,"public")));


app.use(cors({
  origin: "*",
  credentials: true,
  methods:['GET','POST']
}));


app.get("/",function (req,res) {
    res.render("notfound.ejs")
})
module.exports = app


require('./routes/api/user')(app);
require('./routes/admin/dashboard')(app);



let PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
    console.log("App is up and running on "+ PORT);
});