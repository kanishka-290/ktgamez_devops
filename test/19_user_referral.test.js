require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2");
const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

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
        .set("token",store('token'))
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
        .set("token",store('token'))
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
        .set("token",store("token"))
        .set("referral_code","I020MMX1YNXJ")
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
        .set("token",store("token"))
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
        .set("token",store("verified_token"))
        .set("referral_code","I020MMX1YNXJ")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            store.set("condition",false)
            done();
        }
        )
    })
})