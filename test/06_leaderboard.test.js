require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();

const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

describe("Test Leaderboard API", ()=>{


    //Check Leaderboard
    it("Test status", (done)=>{
        chai.request(app)
        .get("/api/index")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
   
})