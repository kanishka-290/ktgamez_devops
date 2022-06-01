require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2")
const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

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
        .set("Authorization","Bearer 123"+store('verified_token'))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated.");
            done();
        }
        )
    })

    //with valid token invalid gameId
    it("with valid token invalid gameId", (done)=>{
        chai.request(app)
        .post("/api/compete/0")
        .set("Authorization","Bearer "+store('verified_token'))
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
        .set("Authorization","Bearer "+store('verified_token'))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.should.have.length(1);
            done();
        }
        )
    })
})