const admin = require("../../controllers/admin/dashboard");
const {check,validationResult} = require("express-validator");
const emailValidator = require("email-validator");
const { min } = require("moment");

module.exports =function(app) {
    
   app.get("/superadmin/", admin.dashboard)

   app.get("/superadmin/login", admin.login);
   app.post("/superadmin/login", [
      check("email","Please enter valid email address")
         .exists()
         .isLength({min:5}),
      check("email","Please enter valid email address")
         .isEmail(),
      check("password","Please enter valid password")
         .isLength({min:5,max:40})
   ], admin.login_post);
   app.get("/superadmin/logout", admin.logout);



   app.get("/forgot-password", admin.forgotpassword)

   

   app.get("/superadmin/genrecreate", admin.grnrecreate)
   app.post("/superadmin/genrecreate",[
      check("genre_name","Genre name is required")
         .exists()
         .isLength({max:30,min:2}),
      check("description","Description is required")
         .exists()
         .isLength({max:300,min:2}),
      check("genre_status","Genre status is required")
         .exists()
   ], admin.grnrecreate_post)


   app.get("/superadmin/genreview", admin.genrelist)
   app.get("/superadmin/gamecreate", admin.addgame)
   app.get("/superadmin/game", admin.gameview)
   app.get("/superadmin/competecreate", admin.leaderboardgamecreate)
   app.get("/superadmin/compete", admin.leaderboardgameview)
   app.get("/superadmin/user", admin.users)
   app.get("/superadmin/settings", admin.settings)
   app.get("/superadmin/leaderboard", admin.referandwin)





}