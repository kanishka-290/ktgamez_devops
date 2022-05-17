require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const store = require("store2")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');



app.use(cors({
  origin: "*",
  credentials: true,
  methods:['GET','POST']
}));


app.get("/",function (req,res) {
    //res.send("Hello user");
    res.render("notfound.ejs")
})
store.set("condition",false)
module.exports = app


require('./routes/api/user')(app);

let PORT = process.env.PORT || 3000;

app.listen(PORT,function(){
    console.log("App is up and running on "+ PORT);
});