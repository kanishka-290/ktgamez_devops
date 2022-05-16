require('dotenv').config();
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should();
const expect = chai.expect();

const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

describe('Game Search', () => { 
    //Token not required

    //without keyword
    it("without keyword", (done)=>{
        chai.request(app)
        .get("/api/search")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })

    //with keyword
    it("with keyword", (done)=>{
        chai.request(app)
        .post("/api/search")
        .send({"keyword":"Battle"})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("array");
            done();
        }
        )
    })
})