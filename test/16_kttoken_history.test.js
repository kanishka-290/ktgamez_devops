require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2")
const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

describe('KT Token History', () => { 

    //Without Token
    it("Without Token", (done)=>{
        chai.request(app)
        .get("/api/tokens")
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
        .get("/api/tokens")
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
        .get("/api/tokens")
        .set("token",store("token"))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})