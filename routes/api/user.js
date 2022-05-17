const api = require("../../controllers/api/user");
const { verifyToken,verifyToken2 } = require("../../utils/verifyToken");

module.exports = function(app){
    app.post("/api/register",api.register);

    app.post("/api/login",api.login);
    
    app.get("/api/user", verifyToken ,api.userdetails);

    app.get("/api/genre/:id" ,api.genre);

    app.get("/api/play/:id",verifyToken, api.play);

    app.get("/api/points",verifyToken ,api.points);

    app.get("/api/index" ,api.leaderboard);

    app.get("/api/ktLeaderboard" ,api.leaderboard);

    app.get("/api/games",verifyToken, api.playandwin);

    app.get("/api/genreslider" ,api.genregames);
    
    app.get("/api/slide/:id" ,api.gamesusinggenreid);
    
    app.post("/api/refer", verifyToken ,api.referralCode);
    
    app.post("/api/entry",verifyToken, api.start);
    
    app.post("/api/compete",verifyToken, api.submitgamescore);
    
    app.get("/api/search", api.searchgame);
    
    app.get("/api/games" ,api.games);

    app.post("/api/compete/:id",verifyToken, api.start2);



    app.post("/api/email/verification-notification",verifyToken,api.verifyemailaccount);

    app.get("/api/tokens", verifyToken ,api.kttokenhistory);

    app.get("/api/ktpointhistory", verifyToken ,api.ktpointshistory);
        
    app.get("/api/login/google" ,api.googlelogin);

    app.post("/api/facebooklogin" ,api.facebooklogin);

    app.post("/api/forgotpassword" ,api.forgotpassword);

    app.get("/verifypassword/:token",verifyToken2, api.resetpassword);

    app.post("/verifypassword/:token",verifyToken2, api.resetpassword2);

    app.get("/verifyemail/:token",verifyToken2, api.verifyemail);

    app.get("/api/verify-email/:id",verifyToken, api.verify_email);
    

    app.post("/api/verifyotp",verifyToken, api.verifyotp);

    app.post("/api/requestsubscription",verifyToken, api.requestsubscription);

   
    app.post("/api/otpsend", api.loginwithotp);


    //other routes..
}
