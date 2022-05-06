require('dotenv').config()
const nodemailer = require('nodemailer');

//Nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aryan.server5638@gmail.com',
      pass: process.env.SMTP_PASSWORD
    }
});


module.exports = {
  transporter,
}