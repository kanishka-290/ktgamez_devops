require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
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
app.use(cors(corsOptions))
// const http = require('http').Server(app);
// const io = require('socket.io')(http);

app.get("/",function (req,res) {
    res.send("Hello user");
})
require('./routes/api/user')(app);

app.listen(3000,function(){
    console.log("App is up and running");
})