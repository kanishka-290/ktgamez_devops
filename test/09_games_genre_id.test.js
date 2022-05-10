require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();

const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

describe("Get Games genre id", ()=>{
    //Get games genre id
    it("Get games genre id", (done)=>{
        chai.request(app)
        .get("/api/genreslider")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})