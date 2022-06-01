require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const store = require("store2")
const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);


describe('Game entry updated or not', () => { 
    //Without token
    it("Without token", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //With Invalid token
    it("Without token", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .set("Authorization","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        }
        )
    })

    //Without Game id
    it("Without Game id", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .set("Authorization","Bearer "+store('verified_token'))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","The given data was invalid.");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //With Game id
    it("With Game id", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .set("Authorization","Bearer "+store('verified_token'))
        .send({game_id: '1'})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("success","Token Balance Updated");
            res.body.should.have.property("gameid");
            res.body.should.have.property("userid");
            done();
        }
        )
    })

    //With incorrect Game id
    it("With incorrect Game id", (done)=>{
        chai.request(app)
        .post("/api/entry")
        .set("Authorization","Bearer "+store('verified_token'))
        .send({game_id: '0'})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Invalid Game id");
            done();
        }
        )
    })
})