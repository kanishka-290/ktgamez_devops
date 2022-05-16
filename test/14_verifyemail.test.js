require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2");
const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

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
        .set("token",store("verified_token"))
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
        .set("token",store("token"))
        .send({})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","A fresh verification link has been sent to your email address.");
            done();
        }
        )
    })
})