require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2")
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

describe('Submit Game Socre', () => { 
    //Without token
    it("Without token", (done)=>{
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

    //With invalid token
    it("With invalid token", (done)=>{
        chai.request(app)
        .post("/api/compete/1")
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
        .post("/api/compete/1")
        .set("token",store("verified_token"))
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
        .post("/api/compete/1")
        .set("token",store("verified_token"))
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
        .post("/api/compete/1")
        .set("token",store("verified_token"))
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