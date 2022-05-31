const admin = require("../../controllers/admin/dashboard");


module.exports =function(app) {
    
   app.get("/superadmin/", admin.dashboard)
   app.get("/superadmin/login", admin.login);
   app.get("/superadmin/genrecreate", admin.grnrecreate)
   app.get("/superadmin/genreview", admin.genrelist)
   app.get("/superadmin/gamecreate", admin.addgame)
   app.get("/superadmin/game", admin.gameview)
   app.get("/superadmin/competecreate", admin.leaderboardgamecreate)
   app.get("/superadmin/compete", admin.gameview)
   app.get("/superadmin/user", admin.users)




}