require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect();
const store = require("store2");
var fs = require("fs");
const chaiHttp = require("chai-http");
const app = require("../app");
chai.use(chaiHttp);

let token;
let verified_token;

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
        
        
        chai.request(app)
        .post("/api/login")
        .send({
            "email":"existingemail@gmail.com",
            "password":"Admin@123"
        })
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            token = res.body.token
            done();
        })
    });

    //with Correct Detail and verified token
    it("with Correct verified Email login", (done)=>{
         
        chai.request(app)
        .post("/api/login")
        .send({
            email:"validemail@gmail.com",
            password:"Admin@123"
        })
        .end(function(err, res){
            
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("token");
            verified_token = res.body.token
            store.setAll({"token":token,"verified_token":verified_token,"condition":true});
            
            done();
        })
    });
})

module.exports = {token,verified_token};