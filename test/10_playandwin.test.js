require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2");
const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

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
        .set("token",store("verified_token"))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})