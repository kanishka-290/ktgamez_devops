const api = require("../../controllers/api/user");
const { verifyToken } = require("../../utils/verifyToken");

module.exports = function(app){

    app.post("/api/login",api.login);
    
    app.post("/api/register",api.register);

    app.get("/api/user", verifyToken ,api.userdetails);
    
    app.get("/api/kttokenhistory", verifyToken ,api.kttokenhistory);
    
    app.get("/api/leaderboards", verifyToken ,api.leaderboard);
    
    app.post("/api/referralCode", verifyToken ,api.referralCode);
    //other routes..
}
