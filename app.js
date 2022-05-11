require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const store = require("store2")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

const whitelist = ["http://localhost:3001","http://localhost:3000"]
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}
app.use(cors(corsOptions));

app.get("/",function (req,res) {
    res.send("Hello user");
})
store.set("condition",false)
module.exports = app


require('./routes/api/user')(app);

let PORT = process.env.PORT
if(PORT == null || PROT == undefined || PORT == ""){
  PORT = 3000
}

app.listen(PORT,function(){
    console.log("App is up and running");
});