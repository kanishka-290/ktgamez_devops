function verifyToken(req,res,next){
    var token = req.headers.token;

    if(token == null || token == undefined || token == ""){
        
        res.send({"message":"Unauthenticated"})
    }else{
        req.token = token

        next();
    }
}
function verifyToken2(req,res,next){
    var token = req.params.token;
    
    if(token == null || token == undefined || token == ""){
        
        res.send({"message":"Unauthenticated"})
    }else{
        req.token = token

        next();
    }
}
module.exports = {
    verifyToken,
    verifyToken2
}