require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();

const chaiHttp = require("chai-http");
const app = require("../app");

chai.use(chaiHttp);

describe("Test game genre API", ()=>{
    //With correct genre id
    it("With correct genre id", (done)=>{
        chai.request(app)
        .get("/api/genre/1")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("genre_name");
            res.body.should.have.property("genre_description");
            done();
        }
        )
    })

    //With incorrect genre id
    it("With incorrect genre id", (done)=>{
        chai.request(app)
        .get("/api/genre/0")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("error");
            done();
        }
        )
    })
})