function verifyToken(req,res,next){
    
    var token = req.headers.authorization;

    if(token == null || token == undefined || token == ""){
        
        res.send({"message":"Unauthenticated"})
    }else{
        var str = token;
        var array = str.split(" ");
        //console.log(array[1]);
        req.token = array[1]
        //req.token = token

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