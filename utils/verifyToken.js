function verifyToken(req,res,next){
    var token = req.headers.token;

    if(token == null || token == undefined || token == ""){
        
        res.send({"message":"Unauthenticated"})
    }else{
        req.token = token

        next();
    }
}
module.exports = {
    verifyToken
}