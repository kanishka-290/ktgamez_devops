require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();

const chaiHttp = require("chai-http");
const app = require("../app");


chai.use(chaiHttp);

describe("Forgot Password", () =>{

    //Without Email
    it("without Email", (done)=>{
        chai.request(app)
        .post("/api/forgotpassword")
        .send({})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","The given data was invalid");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //With Unregistered Email
    it("With Unregistered Email", (done)=>{
        chai.request(app)
        .post("/api/forgotpassword")
        .send({"email":"abcxyz@gmail.com"})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","The given data was invalid");
            res.body.should.have.property("errors");
            done();
        }
        )
    })

    //With already verifird Email
    it("With already verifird Email", (done)=>{
        chai.request(app)
        .post("/api/forgotpassword")
        .send({"email":"aryan17.chavda@gmail.com"})
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","We have sent you an reset password link on your email address which is valid for 15 minutes");
            done();
        }
        )
    })
})