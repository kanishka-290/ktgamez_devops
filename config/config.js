const nodemailer = require('nodemailer');



//Nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aryan.server5638@gmail.com',
      pass: 'aryan@junagadh.2001'
    }
});

function send_mail(from,to,subject,text) {
  var mailOptions = {
    from: 'youremail@gmail.com',
    to: 'myfriend@yahoo.com',
    subject: 'Sending Email using Node.js',
    text: 'That was easy!'
};
 transporter.sendMail(mailOptions, function(error, info){
   if (error) {
     console.log(error);
   } else {
     console.log('Email sent: ' + info.response);
   }
});
}
module.exports = {
  send_mail,
}