const api = require("../../controllers/api/user");
const { verifyToken,verifyToken2 } = require("../../utils/verifyToken");

module.exports = function(app){

    app.post("/api/login",api.login);
    
    app.post("/api/register",api.register);

    app.get("/api/user", verifyToken ,api.userdetails);
    
    app.get("/api/kttokenhistory", verifyToken ,api.kttokenhistory);
    
    app.get("/api/leaderboards", verifyToken ,api.leaderboard);
    
    app.post("/api/referralCode", verifyToken ,api.referralCode);

    app.post("/api/googlelogin" ,api.googlelogin);

    app.post("/api/facebooklogin" ,api.facebooklogin);

    app.get("/api/genre" ,api.genregames);

    app.get("/api/games" ,api.games);

    app.post("/api/forgotpassword" ,api.fotgotpassword);


    app.get("/verifypassword/:token",verifyToken2, api.resetpassword);

    app.post("/verifypassword/:token",verifyToken2, api.resetpassword2);

    app.get("/verifyemail/:token",verifyToken2, api.verifyemail);


    app.get("/test", api.test);

    //other routes..
}
