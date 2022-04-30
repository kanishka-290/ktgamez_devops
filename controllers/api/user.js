require('dotenv').config()
const mysql2 = require("mysql2/promise");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const md5 = require("md5");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const res = require('express/lib/response');
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");
const ejs = require("ejs");
const client = new OAuth2Client("965950927501-simcqlf1ojuhoc4r3nmr5fgi1kdhrg0c.apps.googleusercontent.com");
//Nodemailer
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'aryan.server5638@gmail.com',
      pass: process.env.SMTP_PASSWORD
    }
});

// Create a schema
var schema = new passwordValidator();

// Add properties to it
schema
.is().min(8)                                    // Minimum length 8
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have at least 2 digits
.has().symbols()                                // Must have symbols
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values




// create the connection to database
function sqlConnect(){
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

// Generate Refer code
function generateString() {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < 12; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
}

// Generate OTP
function generateOTP() {
    const characters ='0123456789';

        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < 6; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
}

//send email
function send_mail(from,to,subject,text) {
    var mailOptions = {
      from: from,
      to: to,
      subject: subject,
      text: text
    };
    transporter.sendMail(mailOptions, function(error, info){
     if (error) {
       console.log(error);
     } else {
       console.log('Email sent: ' + info.response);
     }
    });
}



const register = async (req,res) =>{
    try{
        var email = req.body.email;
        var name = req.body.name;
        var password = req.body.password;
        var password_confirmation = req.body.password_confirmation;
        var referral_code = req.body.referral_code;
        var error = {};
        var errorCode = 0;
    if(name == null || name == undefined || name == ""){
            errorCode = 1;
            error["name"]=["The name field is required."]
    }
    if(email == null || email == undefined || email == ""){
            errorCode = 1;
            error["email"]=["The email field is required."]

            
    }else if(!emailValidator.validate(email)){
            errorCode=1;
            error["email"]=["The email must be a valid email address."];
    }
    if(password == null || password == undefined || password == ""){
        errorCode = 1;
        error["password"]=["The password field is required."];
    }
    if(password_confirmation == null || password_confirmation == undefined || password_confirmation == ""){
        errorCode = 1;
        error["password_confirmation"]=["The password confirmation field is required."];
    }else if(!schema.validate(password)){
        errorCode = 1;
        error["password"]=["The password must be 8 characters long.",
        "Password must contain one uppercase latter",
        "Password must contain one lower latter",
        "Password must contain one digit",
        "Password must should not contain blank space",]
    }
    if(password != password_confirmation){
        errorCode = 1;

        error.push({
            "password": [
                "The password confirmation does not match."
            ]
        })
    }
    


    if(errorCode == 1){
        
        res.send({"message":"The given data was invalid","errors":error})
    }else{
        const connection = await sqlConnect();
        
        var [emailcheck,emailfield] = await connection.query("SELECT `id`,`remember_token` FROM `users` WHERE `email`='"+email+"'")
       
        if(emailcheck.length>0){
            res.send({
                "message": "The given data was invalid.",
                "errors": {
                    "email": [
                        "The email has already been taken."
                    ]
                }
            })
        }else{

                var [signup,signupbonus] = await connection.query("SELECT `value` FROM `user_settings`")

                

                //registration
                
                var referral_code_user = generateString();
                var is_referred = "NO";
                if(referral_code != '' && referral_code != null && referral_code != undefined){
                    is_reffered = "YES"
                }

                var [result,field] = await connection.query("INSERT INTO `users` SET `name`='"+name+"',`email`='"+email+"',`is_referred`='"+is_referred+"',`password`='"+md5(password)+"',`referral_code`='"+referral_code_user.trim()+"',`tokens`='"+signup[0]['value']+"',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")


                //referal
                var referal = 0;
                var userId = result.insertId;
                if(referral_code != '' && referral_code != null && referral_code != undefined){
                    var [check,cfield] = await connection.query("SELECT `id` FROM `users` WHERE `referral_code`='"+referral_code+"'")
                    if(check.length>0){
                        var referarId = check[0]['id']
                        referal = signup[1]['value']
                        //user referal
                        var [user_referals,userfields] = await connection.query("INSERT INTO `user_referrals` SET `referred_by`='"+referarId+"',`referred_to`='"+userId+"',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")
                        //update users ktpoints
                        var [updaterefer,urfields] = await connection.query("UPDATE `users` SET `tokens`=(`tokens`+"+referal+") WHERE `id`='"+userId+"'")
                        //Update is reffered to yes
                        var [isrefferefto,istfields] = await connection.query("UPDATE `users` SET `is_referred` = 'YES' WHERE `id`='"+referarId+"'")
                    
                        //Insert into game token history
                        var [game_token,game_fields] = await connection.query("INSERT INTO `game_tokens` SET `user_id`='"+userId+"',`tokens`='"+referal+"',`tokens_type`='Referral Bonus',`created_at`='"+moment().format("YYYY-MM-DD hh:m:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")
                    
                    }
                }

                var [result,field] = await connection.query("SELECT `id` FROM `users` WHERE `id`='"+userId+"'");
                
                var loginTIme = moment().format("YYYY MM DD hh:mm:ss");
                //var send_mail_function = send_mail("aryan.server5638@gmail.com",email,"You are successfully registered with ktgamez","You are successfully registered with ktgamez with this email address.");
                jwt.sign({result},"secretkey",(err,token)=>{
                    console.log("Email: "+email)
                    if(err){
                        console.log(err)
                    }else{
                        var link = "http://localhost:3000/verifyemail/"+token
                        ejs.renderFile("D:\\Giro/ktgamez/views/welcome.ejs", { link: link }, function (err, data) {
                            if (err) {
                                console.log(err);
                            } else {
                                var mainOptions = {
                                    from: 'aryan.server5638@gmail.com',
                                    to: email,
                                    subject: 'Successfully registered with ktgamez',
                                    html: data
                                };
                                transporter.sendMail(mainOptions, function (err, info) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log('Message sent: ' + info.response);
                                    }
                                });
                            }
                            
                            });
                    }
                });
                


                jwt.sign({loginTIme,result},"secretkey",{ expiresIn: '48h'},(err,token)=>{
                    if(err){
                        res.send({"errors": "Something went wrong."})
                    }else{
                        res.send({"success": "user created",token:token})
                    }
                })
                
        }
        
        connection.end();
    }
    
    }catch(err){
        res.send({ "error": "Something went wrong."})
    }
};
const login = async (req,res) =>{
    try{
      var email = req.body.email;
      var password = req.body.password;
      
      if((email == '' || email == null || email == undefined) && (password == '' || password == null || password == undefined)){
          res.send({
             "message": "The given data was invalid.",
             "errors": {
                 "email": [
                     "The email field is required."
                 ],
                 "password": [
                     "The password field is required."
                 ]
             }
      })
      }else if(email == '' || email == null || email == undefined){
         res.send({
             "message": "The given data was invalid.",
             "errors": {
                 "email": [
                     "The email field is required."
                 ]
             }
         })
      }else if(password == '' || password == null || password == undefined){
         res.send({
             "message": "The given data was invalid.",
             "errors": {
                 "password": [
                     "The password field is required."
                 ]
             }
         })
      }else{
 
     
      const connection  = await sqlConnect();
 
      var [result,field] = await connection.query("SELECT `id` FROM `users` WHERE `email`='"+email+"' AND `password`='"+md5(password)+"'")
 
      if(result.length>0){

        var loginTIme = moment().format("YYYY MM DD hh:mm:ss");
         jwt.sign({loginTIme,result},'secretkey',{ expiresIn: '48h'},(err,token)=>{
             res.send({token})
         })
      }else{
         res.send({ "error": "These credentials do not match our records."})
      }
      
      connection.end();
      }
    }catch(err){
        res.send({ "error": "Something went wrong."})
    }
};
const userdetails = async (req,res) =>{
    jwt.verify(req.token,"secretkey",async (err,data)=>{
        if(err){
            res.send({"message":"Unauthenticated"})
        }else{
            try{
                var userId = data.result[0].id;
                
                const connection = await sqlConnect();

                var [user,data] = await connection.query("SELECT * FROM `users` WHERE `id`='"+userId+"'");
                res.send({
                    "id":user[0].id,
                    "name":user[0].name,
                    "email":user[0].email,
                    "avatar":user[0].avatar,
                    "points":user[0].points,
                    "tokens":user[0].tokens,
                    "referral_code":user[0].referral_code,
                    "is_referred":user[0].is_referred,
                    "email_verified_at":user[0].email_verified_at,
                    "created_at":user[0].created_at,
                    "updated_at":user[0].updated_at
                })
                connection.end();
            }catch(err){
                    res.send({
                        "message": "Something went wrong."
                    })
            }
        }
    })
    
};
const leaderboard = async (req,res) =>{
    
    try{
        const connection = await sqlConnect();

        var [result,field] = await connection.query("SELECT `game_leaderboards`.`id`,`game_leaderboards`.`user_id`,`game_leaderboards`.`game_id`,`game_points`.`points`,`points_type`,`game_leaderboards`.`created_at`,`name`,`email`,`avatar`,`score` as `highscore` FROM `game_leaderboards` LEFT JOIN `users` ON `game_leaderboards`.`user_id`=`users`.`id` LEFT JOIN `game_points` ON `game_leaderboards`.`user_id`=`game_points`.`user_id` ORDER BY `score` DESC");
        res.send([result])
        connection.end();
    }catch(err){
        res.send({"message":"Something went wrong"})
    }


};
const genre = async (req,res) =>{
    try{
        const connection = await sqlConnect();
        //console.log(req.body)
        var game_id = req.params.id || "";
        if(game_id == null || game_id == undefined || game_id == ""){
            res.send({"message":"game_id is required"})
        }else{
            console.log("SELECT * FROM `giro_games` WHERE `id`='"+game_id+"'")
            var [games,game_field] = await connection.query("SELECT * FROM `game_genres` WHERE `id`='"+game_id+"'");
            if(games.length>0){
            res.send({
                "id":games[0]['id'],
                "genre_name":games[0]['genre_name'],
                "genre_status":games[0]['genre_status'],
                "genre_description":games[0]['genre_description'],
                "created_at":games[0]['created_at'],
                "updated_at":games[0]['updated_at'],
            })
        }else{
            res.send({"error": "Category not Found."})
        }
        }
        
        connection.end();
    }catch(err){
        res.send({"message":"Something went wrong"})
    }
};
const points = async (req,res) =>{
    try{
        const connection = await sqlConnect();
        var [result,field] = await connection.query("SELECT * FROM `game_points` WHERE 1")
        res.send([result])
        connection.end();
    }catch(err){
        res.send({"message":"Something went wrong"})
    }
};
const playandwin = async (req,res) =>{
    jwt.verify(req.token,"secretkey", async (err,data)=>{
        if(err){
            res.send("Unauthinticated")
        }else{
            try{
                const connection = await sqlConnect();
                
                var [check,cfield] = await connection.query("SELECT `id`,`email_verified_at` FROM `users` WHERE `id`='"+data.result[0].id+"'")

                if(check[0]['email_verified_at']==null){
                    res.send({"message":"Please verify your email first."})
                }else{
                 var [completegames,cgfields] = await connection.query("SELECT * FROM `compete_games` WHERE 1")
                res.send([completegames])
                }
                connection.end();
            }catch(err){
                res.send({"message":"Something went wrong"})

            }
            
        }
    })
};
const genregames = async (req,res) =>{
    try{
        const connection = await sqlConnect();
        var [game_ganer,gamefield] = await connection.query("SELECT * FROM `game_genres` WHERE 1")
        res.send(game_ganer)
        connection.end();
    }catch(err){
        res.send({
            "message": "Something went wrong."
        })
    }
};
const gamesusinggenreid = async(req,res) =>{
    try{
        var ganre_id = req.params.id || "";
        const connection = await sqlConnect();
        var [game_ganer,gamefield] = await connection.query("SELECT * FROM `giro_games` WHERE `genre_id`='"+ganre_id+"'")
        res.send(game_ganer)
        connection.end();
    }catch(err){
        res.send({
            "message": "Something went wrong."
        })
    }
};
const referralCode = async (req,res) =>{
    jwt.verify(req.token,"secretkey",async (err,data)=>{
        if(err){
            res.send({"message":"Unauthenticated"})
        }else{
            try{

                var referral_code = req.body.referral_code;
                if(referral_code == null || referral_code == undefined || referral_code == ""){
                    res.send({
                        "message": "The given data was invalid.",
                        "errors": {
                            "referral_code": [
                                "The referral code field is required."
                            ]
                        }
                    })
                }else{
                var userId = data.result[0].id;
                const connection = await sqlConnect();
               //Check validity for refer code
                var [checkuser,cfields] = await connection.query("SELECT `id` FROM `users` WHERE `referral_code`='"+referral_code+"' AND `id`!='"+userId+"'")
                //Check if user used refercode or not
                var [referred,referredfield] = await connection.query("SELECT `id` FROM `game_tokens` WHERE `user_id`='"+userId+"' AND `tokens_type`='Referral Bonus'")
                if(referred.length>0){
                    res.send({
                        "message": "You are already referred by a user."
                    })
                }else{
                if(checkuser.length>0){
                    var referred_by = checkuser[0]['id'];
                    //Insert into referral history
                    var [entry,efield] = await connection.query("INSERT INTO `user_referrals` SET `referred_by`='"+referred_by+"',`referred_to`='"+userId+"',`created_at`='"+moment().format("YYYY MM DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY MM DD hh:mm:ss")+"'")
                    //Get signup bonus
                    var [user_settings,usfields] = await connection.query("SELECT `value` FROM `user_settings` WHERE `key`='Referral Bonus'")
                    //update userpoints
                    var [update_user,updatefield] = await connection.query("UPDATE `users` SET `tokens`=(`tokens`+"+user_settings[0]['value']+") WHERE `id`='"+userId+"'")
                    //Insert into game token history
                    var [game_token,game_fields] = await connection.query("INSERT INTO `game_tokens` SET `user_id`='"+userId+"',`tokens`='"+user_settings[0]['value']+"',`tokens_type`='Referral Bonus',`created_at`='"+moment().format("YYYY MM DD hh:m:ss")+"',`updated_at`='"+moment().format("YYYY MM DD hh:mm:ss")+"'")
                    //Update is reffered to yes
                    var [isrefferefto,istfields] = await connection.query("UPDATE `users` SET `is_referred` = 'YES' WHERE `id`='"+referred_by+"'")
                    res.send({
                        "message":"Refercode Applied Successfully."
                    })
                }else{
                    res.send({
                        "message": "Referral is invalid "
                    })
                }
                }
                connection.end();
                }
            }catch(err){
                res.send({"message":"Something went wrong"})
            }
        }
    })
};
const submitgamescore = async (req,res) =>{
    jwt.verify(req.token,"secretkey", async (err,data)=>{
        if(err){
            res.send({
                "message": "Unauthenticated"
            })
        }else{
            try{
                var error = {};
                var errorCode = 0;
                const connection = await sqlConnect();
                var [check,cfield] = await connection.query("SELECT `id`,`email_verified_at` FROM `users` WHERE `id`='"+data.result[0].id+"'")
                var id = req.body.id || "";
                var score = req.body.score || "";
                if(check[0]['email_verified_at']==null){
                    errorCode=1;
                    error["email"]=["Please verify your email first."];
                }
                if(id==null || id == undefined || id ==""){
                    errorCode=1;
                    error["email"]=["The game id field is required."];
                    
                }
                if(score==null || score == undefined || score ==""){
                    
                    errorCode=1;
                    error["email"]=["The score field is required."];
                }
                if(score==0){
                    errorCode=1;
                    error["email"]=["Score must be greater than zero."];
                    
                }
                if(errorCode==1){
                    res.send({"message":"The given data was invalid","errors":error})
                }
                else{

                    //add in game points history
                  var [addscore,scorefield] = await connection.query("INSERT INTO `game_points` SET `user_id`='"+data.result[0].id+"',`game_id`='"+id+"',`points`='"+score+"',`points_type`='Game Play',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")
                
                    //add in game token history
                    var [updateuser,ufield] = await connection.query("UPDATE `users` SET `points`=(`points`+"+score+") WHERE `id`='"+data.result[0].id+"'");
                    
                    //Leaderboard Games
                    var [leaderboard,leaderfield] = await connection.query("SELECT `id` FROM `game_leaderboards` WHERE `user_id`='"+data.result[0].id+"' AND `game_id`='"+id+"'")
                    if(leaderboard.length>0){
                        var [update,ufield] = await connection.query("UPDATE `game_leaderboards` SET `score`=(`score`+"+score+"),`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"' WHERE `user_id`='"+data.result[0].id+"' AND `game_id`='"+id+"'")
                    }else{
                        var [update,ufield] = await connection.query("INSERT INTO `game_leaderboards` SET `score`='"+score+"',`user_id`='"+data.result[0].id+"',`game_id`='"+id+"',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'");

                    }
                    res.send({
                        "success": "Successfully submitted the score."
                    })
                }
                connection.end();
            }catch(err){
                res.send({"message":"Something went wrong"})

            }
            
        }
    })
};
const searchgame = async (req,res) =>{
    try{
        var keyword = req.body.keyword || "";
        const connection = await sqlConnect();
        var [result,field] = await connection.query("SELECT * FROM `giro_games` LEFT JOIN `game_genres` ON `giro_games`.`genre_id`=`game_genres`.`id` WHERE `game_name` LIKE '%"+keyword+"%'")
        if(result.length>0){
            res.send(result)
        }else{
            res.send({"message":"No Games found"})
        }
        
        connection.end();
    }catch(err){
        res.send({"message":"Something went wrong"})
    }
};
const compete = async (req,res) =>{
    jwt.verify(req.token,"secretkey", async (err,data)=>{
        if(err){
            res.send({
                "message": "Unauthenticated."
            })
        }else{
            try{
                const connection = await sqlConnect();
                var [check,cfield] = await connection.query("SELECT `id`,`email_verified_at` FROM `users` WHERE `id`='"+data.result[0].id+"'")
                var id = req.params.id || "";
                if(check[0]['email_verified_at']==null){
                    res.send({"message":"Please verify your email first."})
                }else if(id==null || id == undefined || id ==""){
                    res.send({"message":"id is required."})
                }else{
                 var [completegames,cgfields] = await connection.query("SELECT * FROM `compete_games` WHERE `id`='"+id+"'")
                res.send([{
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                    id:completegames[0]['id'],
                }])
                }
                connection.end();
            }catch(err){
                res.send({"message":"Something went wrong"})

            }
            
        }
    })
};
const start = async (req,res) =>{
    jwt.verify(req.token,"secretkey", async (err,data)=>{
        if(err){
            res.send({
                "message": "Unauthenticated."
            })
        }else{
            try{
                const connection = await sqlConnect();
                var [check,cfield] = await connection.query("SELECT `id`,`email_verified_at` FROM `users` WHERE `id`='"+data.result[0].id+"'")
                var id = req.params.id || "";
                if(check[0]['email_verified_at']==null){
                    res.send({"message":"Please verify your email first."})
                }else if(id==null || id == undefined || id ==""){
                    res.send({"message":"id is required."})
                }else{
                    var [game,gamefield] = await connection.query("SELECT * FROM `compete_games` WHERE `id`='"+id+"'")
                    
                    //Deduct entry tokens
                    var [updateuser,ufield] = await connection.query("UPDATE `users` SET `tokens`=(`tokens`-"+game[0]['entry_tokens']+") WHERE `id`='"+data.result[0].id+"'")
                    
                    //add trensection history
                    var [add,tfield] = await connection.query("INSERT INTO `game_tokens` SET `user_id`='"+data.result[0].id+"',`game_id`='"+id+"',`tokens`='"+game[0]['entry_tokens']+"',`tokens_type`='Entry Fee',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")
                    
                    res.send(game)
                }
                connection.end();
            }catch(err){
                res.send({"message":"Something went wrong"})

            }
            
        }
    })
};
const verifyemailaccount = async (req,res) =>{

    jwt.verify(req.token,"secretkey",async (err,data)=>{
        if(err){
            res.send({"message":"Unauthenticated"})
        }else{
            try{
                
                var userId = data.result[0].id;
                
                const connection = await sqlConnect();
                var [emailData,efield] = await connection.query("SELECT `id`,`email`,`email_verified_at` FROM `users` WHERE `id`='"+userId+"'")
                var email = emailData[0]['email'];
                if(emailData[0]['email_verified_at']==null ||emailData[0]['email_verified_at']=="" ||emailData[0]['email_verified_at']==undefined){
                    var [result,field] = await connection.query("SELECT `id` FROM `users` WHERE `email`='"+email+"'");
                    jwt.sign({result},"secretkey",(err,token)=>{
                        if(err){
                            console.log(err)
                        }else{
                            var link = "http://localhost:3000/verifyemail/"+token
                            ejs.renderFile("D:\\Giro/ktgamez/views/welcome.ejs", { link: link }, function (err, data) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(email)
                                    var mainOptions = {
                                        from: 'aryan.server5638@gmail.com',
                                        to: email,
                                        subject: 'Verify your account with ktgamez',
                                        html: data
                                    };
                                    transporter.sendMail(mainOptions, function (err, info) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log('Message sent: ' + info.response);
                                        }
                                    });
                                }
                                
                                });
                        }
                    })
                    res.send({"message":"We have sent you a fresh email verification link to your email. please verify your email account."})
                    
                }else{
                    res.send({
                        "success": "User is Already Verified Return to Home Page"
                    })
                }
                connection.end();
            }catch(err){
                    res.send({
                        "message": "Something went wrong."
                    })
            }
        }
    })
    
};




const googlelogin = async (req,res) =>{

    try{
    //console.log(req.body)
    const connection = await sqlConnect();
    const tokenId = req.body.tokenId;

    client.verifyIdToken({idToken:tokenId,audience:"965950927501-simcqlf1ojuhoc4r3nmr5fgi1kdhrg0c.apps.googleusercontent.com"}).then(async response =>{
        const {email_verified,email,name,picture} = response.payload;
        //console.log(response.payload)
        var [findUser,findDetail] = await connection.query("SELECT `id` FROM `users` WHERE `email`='"+email+"'");

        if(findUser.length>0){

            var loginTIme = moment().format("YYYY MM DD hh:mm:ss");
            jwt.sign({loginTIme,findUser},'secretkey',{ expiresIn: '48h'},(err,token)=>{
            res.send({token})
         })
        }else{
            //generate refer code
            var referral_code = generateString();

            //get signup bonus
            var [signup,signupfield] = await connection.query("SELECT `value` FROM `user_settings` WHERE `key`='Signup Bonus'")
            
            //Add data to users table
            var [register,rfield] = await connection.query("INSERT INTO `users` SET `email`='"+email+"',`name`='"+name+"',`tokens`='"+signup[0]['value']+"',`avatar`='"+picture+"',`email_verified_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`referral_code`='"+referral_code+"',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")
            
            //fetch the inserted id
            var userId = register.insertId;
            
            //Add data to social Identities
            var [social_identities,social_fields] = await connection.query("INSERT INTO `social_identities` SET `user_id`='"+userId+"',`provider_name`='Google',`avatar`='"+picture+"',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")
            
            //Get user detail
            var [result,field] = await connection.query("SELECT `id` FROM `users` WHERE `email`='"+email+"'")

            var loginTIme = moment().format("YYYY MM DD hh:mm:ss");
            jwt.sign({loginTIme,result},'secretkey',{ expiresIn: '48h'},(err,token)=>{
             res.send({token})
         })
            
        }
        
    })
    connection.end();
    }catch(err){
        
    }
};
const facebooklogin = async (req,res) =>{

    const {userID,accesstoken} = req.body;

    let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userID}/?fields=id,name,email,picture&access_token=${accesstoken}`;
    fetch(urlGraphFacebook,{
        method:"GET"
    })
    .then(res => res.json())
    .then(async json => {
        try{
            const connection = await sqlConnect();

            var {id,name,email,picture} = json;
            var picture = picture.data.url
        //console.log(picture.data.url)
        var [findUser,findDetail] = await connection.query("SELECT `id` FROM `users` WHERE `email`='"+email+"'");

        if(findUser.length>0){

            var loginTIme = moment().format("YYYY MM DD hh:mm:ss");
            jwt.sign({loginTIme,findUser},'secretkey',{ expiresIn: '48h'},(err,token)=>{
            res.send({token})
         })
        }else{
            //generate refer code
            var referral_code = generateString();

            //get signup bonus
            var [signup,signupfield] = await connection.query("SELECT `value` FROM `user_settings` WHERE `key`='Signup Bonus'")
            
            //Add data to users table
            var [register,rfield] = await connection.query("INSERT INTO `users` SET `email`='"+email+"',`name`='"+name+"',`tokens`='"+signup[0]['value']+"',`avatar`='"+picture+"',`email_verified_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`referral_code`='"+referral_code+"',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")
            
            //fetch the inserted id
            var userId = register.insertId;
            
            //Add data to social Identities
            var [social_identities,social_fields] = await connection.query("INSERT INTO `social_identities` SET `user_id`='"+userId+"',`provider_name`='Facebook',`avatar`='"+picture+"',`created_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"',`updated_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"'")
            
            //Get user detail
            var [result,field] = await connection.query("SELECT `id` FROM `users` WHERE `email`='"+email+"'")

            var loginTIme = moment().format("YYYY MM DD hh:mm:ss");
            jwt.sign({loginTIme,result},'secretkey',{ expiresIn: '48h'},(err,token)=>{
             res.send({token})
         })
            
        }

            connection.end();
        }catch(err){
            res.send({"errors":"Something went wrong"})
        }
    })
};


const kttokenhistory = async (req,res) =>{
    jwt.verify(req.token,"secretkey",async (err,data)=>{
        if(err){
            res.send({"message":"Unauthenticated"})
        }else{
            try{
                var userId = data.result[0].id;
                
                const connection = await sqlConnect();

                var [result,data] = await connection.query("SELECT `id`,`tokens`,`tokens_type`,`created_at` FROM `game_tokens` WHERE `user_id`='"+userId+"' ORDER BY `created_at` DESC");
                res.send({result})
                connection.end();
            }catch(err){
                    res.send({
                        "message": "Something went wrong."
                    })
            }
        }
    })
};


const games = async (req,res) =>{
    try{
        const connection = await sqlConnect();
        //console.log(req.body)
        var genreId = req.body.genreId || "";
        if(genreId == null || genreId == undefined || genreId == ""){
            res.send({"message":"genreId is required"})
        }else{
            var [games,game_field] = await connection.query("SELECT `id`,`genre_id`,`game_name`,`game_description`,`game_cover_url`,`game_play_url`,`genre_slider`,`game_status` FROM `giro_games` WHERE `genre_id`='"+genreId+"'")
            res.send({games})
        }
        
        connection.end();
    }catch(err){
        res.send({"message":"Something went wrong"})
    }
};
const ktpointshistory = async (req,res) =>{
    jwt.verify(req.token,"secretkey",async (err,data)=>{
        if(err){
            res.send({"message":"Unauthenticated"})
        }else{
            try{
                var userId = data.result[0].id;
                
                const connection = await sqlConnect();

                var [ktpoint,field] = await connection.query("SELECT * FROM `game_points` WHERE `user_id`='"+userId+"'")
                if(ktpoint.length>0){
                    res.send(ktpoint)
                }else{
                    res.send({"message":"No history found"})
                }
                connection.end();
            }catch(err){
                    res.send({
                        "message": "Something went wrong."
                    })
            }
        }
    })
};
const fotgotpassword = async (req,res) =>{
    try{

        var email = req.body.email || "";

        if(email == null || email == undefined || email == ""){
            res.send({"message":"The given data was invalid","errors":["Email field is required"]})
        }else{

        const connection = await sqlConnect();

        var [checkUser,checkfield] = await connection.query("SELECT `id` FROM `users` WHERE `email`='"+email+"'")
        if(checkUser.length>0){
        var payload = {
            "id":checkUser[0]['id'],
            "email":email
        };
        const token = jwt.sign(payload,process.env.SECRET_KEY,{expiresIn:"15m"})
        var generateLink = "http://localhost:3000/verifypassword/"+token;
        console.log(generateLink)
        //send_mail("aryan.server5638@gmail.com",email,"Reset your password","Reset your password using this link  "+generateLink)
        
        ejs.renderFile("D:\\Giro/ktgamez/views/reset_password.ejs", { generateLink: generateLink }, function (err, data) {
            if (err) {
                console.log(err);
            } else {
                var mainOptions = {
                    from: 'aryan.server5638@gmail.com',
                    to: email,
                    subject: 'Reset password notification',
                    html: data
                };
                //console.log("html data ======================>", mainOptions.html);
                transporter.sendMail(mainOptions, function (err, info) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Message sent: ' + info.response);
                    }
                });
            }
            
            });

        
        res.send({"message":"We have sent you an reset password link on your email address which is valid for 15 minutes"})
        }else{
            res.send({"message":"The given data was invalid","errors":["Email not found in our records"]})

        }
        connection.end();
        }
    }catch(err){
        res.send({"message":"Something went wrong"})
    }
};
const resetpassword = async (req,res) =>{
        
    jwt.verify(req.token,process.env.SECRET_KEY, async (err,data)=>{
            if(err){
                res.render("notfound.ejs")
            }else{
                //console.log(data);
                res.render("resetpassword.ejs",{email:data.email})
            }
        })
};
const resetpassword2 = async (req,res) =>{
    
    console.log(req.body);
    jwt.verify(req.token,process.env.SECRET_KEY, async (err,data)=>{
        if(err){
            res.render("notfound.ejs")
        }else{
            console.log(data);
            const connection = await sqlConnect();
            var [update,ufields] = await connection.query("UPDATE `users` SET `password`='"+md5(req.body.password1)+"' WHERE `id`='"+data.userId+"'")
            connection.end();
            res.render("success.ejs",{email:data.email})
        }
    })
    
};
const verifyemail = async (req,res) =>{
    jwt.verify(req.token,"secretkey", async (err,data)=>{
        if(err){
            res.render("notfound.ejs")
        }else{
            //console.log(data);
            try{
                const connection = await sqlConnect();
                var [check,fields] = await connection.query("SELECT `id`,`email_verified_at` FROM `users` WHERE `email_verified_at`=null AND `id`='"+data.result[0]['id']+"'")
                if(check.length==0){
                    
                    var [update,field] = await connection.query("UPDATE `users` SET `email_verified_at`='"+moment().format("YYYY-MM-DD hh:mm:ss")+"' WHERE `id`='"+data.result[0]['id']+"'")
                    res.render("emailverified.ejs",{verified:"Email verified successfully"})
                }else{
                    res.render("emailverified.ejs",{verified:"Email already verified"})
                   
                }
                connection.end();
            }catch(err){
                res.render("notfound.ejs")
            }
            res.render("resetpassword.ejs",{email:data.email})
        }
    })
};




const test = async (req,res) =>{
    res.render("welcome.ejs",{generateLink :"Aryan"})
};

module.exports = {
    login,
    register,
    userdetails,
    genre,
    points,
    leaderboard,
    genregames,
    games,
    gamesusinggenreid,
    playandwin,



    verifyemailaccount,
    kttokenhistory,
    ktpointshistory,
    
    referralCode,
    googlelogin,
    facebooklogin,
    
    fotgotpassword,
    resetpassword,
    resetpassword2,
    verifyemail,
    
    compete,
    start,
    submitgamescore,
    searchgame,

    test,
}