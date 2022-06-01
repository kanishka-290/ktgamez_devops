require('dotenv').config()
const mocha = require("mocha");
const chai = require("chai");
const should = chai.should()
const expect = chai.expect();
const chaiHttp = require("chai-http");
const app = require("../app");
const store = require("store2");

chai.use(chaiHttp);

describe("Get User Details", async ()=>{
    
    

    // var check = function(done) {
        
    //     if (store.get('condition')==true) done();
    //     else setTimeout( function(){ 
    //         console.log("Hi")
            
    //         check(done) }, 1000 );
    // }
    // before(function( done ){
    //     check( done );
    // });

    //with correct token
    it("with correct token", (done)=>{
        chai.request(app)
        .get("/api/user")
        .set("Authorization","Bearer "+store('token'))
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("id");
            res.body.should.have.property("email");
            res.body.should.have.property("name");
            done();
        })
    } )

    //with incorrect token
    it("with incorrect token", (done)=>{
        chai.request(app)
        .get("/api/user")
        .set("token","123")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        })
    })

    //without token
    it("without token", (done)=>{
        chai.request(app)
        .get("/api/user")
        .end(function(err, res){
            res.should.have.status(200);
            res.body.should.be.a("object");
            res.body.should.have.property("message","Unauthenticated");
            done();
        })
    })
})



// let token;
// chai.request(app)
//         .post("/api/login")
//         .send({
//             email:"existingemail@gmail.com",
//             password:"Admin@123"
//         })
//         .end(function(err, res){
//             res.should.have.status(200);
//             res.body.should.be.a("object");
//             res.body.should.have.property("token");
//             token = res.body.token
//         })

// describe("Get User Details", ()=>{
    
//     //with correct token
//     it("with correct token", (done)=>{
//         console.log(token)
//         chai.request(app)
//         .get("/api/user")
//         .set("token",token)
//         .end(function(err, res){
//             res.should.have.status(200);
//             res.body.should.be.a("object");
//             res.body.should.have.property("id");
//             res.body.should.have.property("email");
//             res.body.should.have.property("name");
//             done();
//         })
//     })

//     //with incorrect token
//     it("with incorrect token", (done)=>{
//         chai.request(app)
//         .get("/api/user")
//         .set("token","123")
//         .end(function(err, res){
//             res.should.have.status(200);
//             res.body.should.be.a("object");
//             res.body.should.have.property("message","Unauthenticated");
            
//             done();
//         })
//     })

//     //without token
//     it("without token", (done)=>{
//         chai.request(app)
//         .get("/api/user")
//         .end(function(err, res){
//             res.should.have.status(200);
//             res.body.should.be.a("object");
//             res.body.should.have.property("message","Unauthenticated");
//             done();
//         })
//     })
// })