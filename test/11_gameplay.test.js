require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2");
const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

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
        .set("Authorization","Bearer "+store('token'))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            done();
        }
        )
    })

    //invalid Game Id
    it("with correct token and Invalid game id", (done)=>{
        chai.request(app)
        .get("/api/play/0")
        .set("token",store("verified_token"))
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
        .set("token",store("verified_token"))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message");
            done();
        }
        )
    })
})