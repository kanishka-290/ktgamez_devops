require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();

const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

describe("Test login API",()=>{
    //with blank details
    it("with blank details", (done)=>{
        let post = {}
        chai.request(app)
        .post("/api/login")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    });

    //with blank password
    it("with blank Password", (done)=>{
        let post = {
            "email":"aryan@gmail.com"
        }
        chai.request(app)
        .post("/api/login")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    });

    //with blank email
    it("with blank Email", (done)=>{
        let post = {
            "password":"123"
        }
        chai.request(app)
        .post("/api/login")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    });

    //with Correct Detail
    it("with Correct Email", (done)=>{
        let post = {
            email:"aryan17.chavda@gmail.com",
            password:"Admin@123"
        }
        chai.request(app)
        .post("/api/login")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            done();
        })
    });
})

describe("Test Register API", ()=>{


    //Check Register

    //with blank details
    it("with blank details", (done)=>{
        let post = {}
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    })
    //with Few details
    it("with Few details", (done)=>{
        let post = {
            name:"aryan"
        }
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    })
    //with Invalid Email
    it("with Invalid Email", (done)=>{
        let post = {
            name:"aryan",
            "email":"aryan"
        }
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    })
    //with invalid password
    it("with invalid password", (done)=>{
        let post = {
            name:"aryan",
            email:"er.aryan.chavda@gmail.com",
            password:"123"
        }
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    })
    //with Invalid password confirmation
    it("with invalid password confirmation", (done)=>{
        let post = {
            name:"aryan",
            email:"er.aryan.chavda@gmail.com",
            password:"123",
            password_confirmation:"456"
        }
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    })
    //Valid Existing Data
    it("with Valid Details", (done)=>{
        let post = {
            name:"aryan",
            email:"er.aryan.chavda@gmail.com",
            password:"Admin@123",
            password_confirmation:"Admin@123",
            phone:7984854459
        }
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
            done();
        })
    })
    //Valid non Existing Data
    it("Valid non Existing Data", (done)=>{
        let post = {
            name:"aryan",
            email:"er.aryan.chavda2@gmail.com",
            password:"Admin@123",
            password_confirmation:"Admin@123",
            phone:7984854459
        }
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success");
            res.body.should.have.property("token");
            done();
        })
    })
   
})

describe("Get User Details", ()=>{

    //with correct token
    it("with correct token", (done)=>{
        chai.request(app)
        .get("/api/user")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("email");
            res.body.should.have.property("name");
            
            done();
        })
    })

    //with incorrect token
    it("with incorrect token", (done)=>{
        chai.request(app)
        .get("/api/user")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            
            done();
        })
    })

    //without token
    it("without token", (done)=>{
        chai.request(app)
        .get("/api/user")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        })
    })
})

describe("Test Leaderboard API", ()=>{


    //Check Leaderboard
    it("Test status", (done)=>{
        chai.request(app)
        .get("/api/index")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
   
})

describe("Test game genre API", ()=>{
    //With correct genre id
    it("With correct genre id", (done)=>{
        chai.request(app)
        .get("/api/genre/1")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("genre_name");
            res.body.should.have.property("genre_description");
            done();
        }
        )
    })

    //With incorrect genre id
    it("With incorrect genre id", (done)=>{
        chai.request(app)
        .get("/api/genre/0")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("error");
            done();
        }
        )
    })
})

describe('Test game play API', () => { 

    //Without token
    it("Without token", (done)=>{
        chai.request(app)
        .get("/api/play/43")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //with correct token and unverified email
    it("with correct token and unverified email", (done)=>{
        chai.request(app)
        .get("/api/play/43")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //invalid Game Id
    it("with correct token and unverified email", (done)=>{
        chai.request(app)
        .get("/api/play/0")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //All valid details
    it("with correct token and unverified email", (done)=>{
        chai.request(app)
        .get("/api/play/43")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("game_cover_url");
            res.body.should.have.property("game_play_url");
            done();
        }
        )
    })
 })

describe("KT Points History", () =>{
    //Without token
    it("Without token", (done)=>{
        chai.request(app)
        .get("/api/points")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //Without incorrect token
    it("Without token", (done)=>{
        chai.request(app)
        .get("/api/points")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //User having no history
    it("User having no history", (done)=>{
        chai.request(app)
        .get("/api/points")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //User having history
    it("User having history", (done)=>{
        chai.request(app)
        .get("/api/points")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})

describe("play and win games", ()=>{
    //Without token
    it("Without token", (done)=>{
        chai.request(app)
        .get("/api/games")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //With invalid token
    it("With invalid token", (done)=>{
        chai.request(app)
        .get("/api/games")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //With valid token
    it("With valid token", (done)=>{
        chai.request(app)
        .get("/api/games")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})

describe("Get Games genre id", ()=>{
    //Get games genre id
    it("Get games genre id", (done)=>{
        chai.request(app)
        .get("/api/genreslider")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})

describe("Get Games using genre id", ()=>{
    //Get games using valid genre id
    it("Get games using valid genre id", (done)=>{
        chai.request(app)
        .get("/api/slide/5")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })

    //Get games using invalid genre id
    it("Get games using invalid genre id", (done)=>{
        chai.request(app)
        .get("/api/slide/0")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.should.have.length(0)
            done();
        }
        )
    })
})

describe("User Referral",()=>{
    //Without token
    it("Without token", (done)=>{
        chai.request(app)
        .post("/api/refer")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //With invalid token
    it("With invalid token", (done)=>{
        chai.request(app)
        .post("/api/refer")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //Withour referral Code
    it("Withour referral Code", (done)=>{
        chai.request(app)
        .post("/api/refer")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //With invalid referral Code
    it("With invalid referral Code", (done)=>{
        chai.request(app)
        .post("/api/refer")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .set("referral_code","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //With valid referral Code
    it("With valid referral Code", (done)=>{
        chai.request(app)
        .post("/api/refer")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .set("referral_code","M4DHUVGXXJ5B")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //Already used referral Code
    it("Already used referral Code", (done)=>{
        chai.request(app)
        .post("/api/refer")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .set("referral_code","M4DHUVGXXJ5B")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })

    //Using Self Referral Code
    it("Already used referral Code", (done)=>{
        chai.request(app)
        .post("/api/refer")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .set("referral_code","M4DHUVGXXJ5B")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })
})

describe('Game entry updated or not', () => { 
    //Without token
    it("Without token", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //With Invalid token
    it("Without token", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //Without Game id
    it("Without Game id", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","The given data was invalid.");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //With Game id
    it("With Game id", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .send({game_id: '1'})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success","Token Balance Updated");
            res.body.should.have.property("gameid");
            res.body.should.have.property("userid");
            done();
        }
        )
    })

    //With incorrect Game id
    it("With incorrect Game id", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .send({game_id: '0'})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Invalid Game id");
            done();
        }
        )
    })
})

describe('Submit Game Socre', () => { 
    //Without token
    it("Without token", (done)=>{
        chai.request(app)
        .post("/api/compete")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //With invalid token
    it("With invalid token", (done)=>{
        chai.request(app)
        .post("/api/compete")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //Without post fields
    it("Without post fields", (done)=>{
        chai.request(app)
        .post("/api/compete")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","The given data was invalid");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //with score 0
    it("with score 0", (done)=>{
        chai.request(app)
        .post("/api/compete")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .send({"game_id":"1","score":"0"})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","The given data was invalid");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //with Valid Data
    it("with Valid Data", (done)=>{
        chai.request(app)
        .post("/api/compete")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .send({"id":"1","score":"10"})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success","Successfully submitted the score.");
            done();
        }
        )
    })
})

describe('Game Search', () => { 
    //Token not required

    //without keyword
    it("without keyword", (done)=>{
        chai.request(app)
        .post("/api/search")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })

    //with keyword
    it("with keyword", (done)=>{
        chai.request(app)
        .post("/api/search")
        .send({"keyword":"Battle"})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})

describe('Play and win games token', () => { 
    //without token
    it("without token", (done)=>{
        chai.request(app)
        .post("/api/compete/1")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //with invalid token
    it("with invalid token", (done)=>{
        chai.request(app)
        .post("/api/compete/1")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //with valid token invalid gameId
    it("with valid token invalid gameId", (done)=>{
        chai.request(app)
        .post("/api/compete/0")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Something went wrong");
            done();
        }
        )
    })

    //with valid token valid gameId
    it("with valid token valid gameId", (done)=>{
        chai.request(app)
        .post("/api/compete/1")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.should.have.length(1);
            done();
        }
        )
    })
})

describe("Forgot Password", () =>{

    //Without Email
    it("without Email", (done)=>{
        chai.request(app)
        .post("/api/forgotpassword")
        .send({})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","The given data was invalid");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //With Unregistered Email
    it("With Unregistered Email", (done)=>{
        chai.request(app)
        .post("/api/forgotpassword")
        .send({"email":"abcxyz@gmail.com"})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","The given data was invalid");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //With already verifird Email
    it("With already verifird Email", (done)=>{
        chai.request(app)
        .post("/api/forgotpassword")
        .send({"email":"aryan17.chavda@gmail.com"})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","We have sent you an reset password link on your email address which is valid for 15 minutes");
            done();
        }
        )
    })
})

describe('Verify Email', () => { 
    //Without Token
    it("Without Token", (done)=>{
        chai.request(app)
        .post("/api/email/verification-notification")
        .send({})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //With Invalid Token
    it("With Invalid Token", (done)=>{
        chai.request(app)
        .post("/api/email/verification-notification")
        .set("token","123")
        .send({})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //With valid Token Already verified
    it("With valid Token Already verified", (done)=>{
        chai.request(app)
        .post("/api/email/verification-notification")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .send({})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success","User is Already Verified Return to Home Page");
            done();
        }
        )
    })

    //With valid Token not verified
    it("With valid Token not verified", (done)=>{
        chai.request(app)
        .post("/api/email/verification-notification")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .send({})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","We have sent you a fresh email verification link to your email. please verify your email account.");
            done();
        }
        )
    })
})

describe('KT Token History', () => { 

    //with valid token
    it("Without Token", (done)=>{
        chai.request(app)
        .get("/api/kttokenhistory")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //with invalid token
    it("with invalid token", (done)=>{
        chai.request(app)
        .get("/api/kttokenhistory")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //with valid token
    it("with valid token", (done)=>{
        chai.request(app)
        .get("/api/kttokenhistory")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})

describe('KT Token History', () => { 

    //with valid token
    it("Without Token", (done)=>{
        chai.request(app)
        .get("/api/ktpointhistory")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //with invalid token
    it("with invalid token", (done)=>{
        chai.request(app)
        .get("/api/ktpointhistory")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //with valid token
    it("with valid token", (done)=>{
        chai.request(app)
        .get("/api/ktpointhistory")
        .set("token",process.env.AUTHENTICATION_TOKEN)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})