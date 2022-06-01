require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2");
const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

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
    it("Without incorrect token", (done)=>{
        chai.request(app)
        .get("/api/points")
        .set("Authorization","Bearer 123"+store('verified_token'))
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
        .set("Authorization","Bearer "+store('verified_token'))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})