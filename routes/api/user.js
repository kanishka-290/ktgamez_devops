const api = require("../../controllers/api/user");
const { verifyToken,verifyToken2 } = require("../../utils/verifyToken");

module.exports = function(app){

    app.post("/api/login",api.login);
    
    app.post("/api/register",api.register);

    app.get("/api/user", verifyToken ,api.userdetails);

    app.get("/api/genre/:id" ,api.genre);

    app.get("/api/points" ,api.points);

    app.get("api/index" ,api.leaderboard);

    app.get("api/ktLeaderboard" ,api.leaderboard);

    app.get("/api/games",verifyToken, api.playandwin);
    
    app.get("/api/genreslider" ,api.genregames);

    app.get("/api/slide/:id" ,api.gamesusinggenreid);

    app.get("/api/games" ,api.games);

    app.post("/api/compete",verifyToken, api.submitgamescore);

    app.get("/api/compete/:id",verifyToken, api.start);

    app.post("/api/search", api.searchgame);

    app.post("/api/email/verification-notification",verifyToken,api.verifyemailaccount);





    app.get("/api/kttokenhistory", verifyToken ,api.kttokenhistory);

    app.get("/api/ktpointhistory", verifyToken ,api.ktpointshistory);
        
    app.post("/api/referralCode", verifyToken ,api.referralCode);

    app.post("/api/googlelogin" ,api.googlelogin);

    app.post("/api/facebooklogin" ,api.facebooklogin);


    app.post("/api/forgotpassword" ,api.fotgotpassword);


    app.get("/verifypassword/:token",verifyToken2, api.resetpassword);

    app.post("/verifypassword/:token",verifyToken2, api.resetpassword2);

    app.get("/verifyemail/:token",verifyToken2, api.verifyemail);

    app.get("/api/compete/:id",verifyToken, api.compete);

    







    app.get("/test", api.test);

    //other routes..
}
