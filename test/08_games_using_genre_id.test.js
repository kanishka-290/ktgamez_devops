require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();

const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

describe("Get Games using genre id", ()=>{
    //Get games using valid genre id
    it("Get games using valid genre id", (done)=>{
        chai.request(app)
        .get("/api/slide/5")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })

    //Get games using invalid genre id
    it("Get games using invalid genre id", (done)=>{
        chai.request(app)
        .get("/api/slide/0")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            res.body.should.have.length(0)
            done();
        }
        )
    })
})