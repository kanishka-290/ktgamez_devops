// import 'dotenv/config'
// import express from 'express';
// import cors from "cors";
// import bodyParser from "body-parser"
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

const whitelist = ["http://localhost:3001"]
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


app.get("/",function (req,res) {
    res.send("Hello user");
})
require('./routes/api/user')(app);

app.listen(3000,function(){
    console.log("App is up and running");
})