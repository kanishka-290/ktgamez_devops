require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const sqlConnect= require("../config/dbconnection")

const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);




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
    
    //Valid non Existing Data
    it("Valid non Existing Data", async ()=>{
        
        const connection = await sqlConnect();
        //console.log("Deleting")
        await connection.query("DELETE FROM `users` WHERE `email`='existingemail@gmail.com'")
        await connection.query("DELETE FROM `users` WHERE `email`='validemail@gmail.com'")
        .then(async function () {  
        await connection.query("INSERT INTO `users` SET `name`='Verified email',`email`='validemail@gmail.com',`tokens`='10000',`referral_code`='I020MMX1YNXJ',`email_verified_at`='2022-04-12 16:52:41',`password`='0e7517141fb53f21ee439b355b5a1d0a'")
        .then(function(){
            //console.log("Deleted")

        let post = {
            name:"Aryan",
            email:"existingemail@gmail.com",
            password:"Admin@123",
            password_confirmation:"Admin@123"
        }
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success");
            res.body.should.have.property("token");
            })
        
        })

    })
    })

    //Valid Existing Data
    it("with Valid Details", ()=>{
        let post = {
            name:"aryan",
            email:"existingemail@gmail.com",
            password:"Admin@123",
            password_confirmation:"Admin@123"
        }
        chai.request(app)
        .post("/api/register")
        .send(post)
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("errors");
            res.body.should.have.property("message");
           
        })
    })
   
})
