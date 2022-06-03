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
   app.get("/superadmin/genredelete/:id", admin.genredelete)
   app.get("/superadmin/genreupdate-:id", admin.genreeditlink)
   app.post("/superadmin/genreupdate-:id",[
      check("genre_name","Genre name is required")
         .exists()
         .isLength({max:30,min:2}),
      check("description","Description is required")
         .exists()
         .isLength({max:300,min:2}),
      check("genre_status","Genre status is required")
         .exists()
   ], admin.genreupdate)
   app.get("/superadmin/genreview", admin.genrelist)


   app.get("/superadmin/gamecreate", admin.addgame)
   app.post("/superadmin/gamecreate",[
      check("game_name","Game name is required")
         .exists()
         .isLength({max:30,min:2}),
      check("genre_id","Genre is required")
         .exists()
         .isNumeric(),
      check("game_description","Description is required")
         .exists()
         .isLength({max:300,min:2}),
      check("game_cover_url","Game cover url is required")
         .exists(),
      check("game_play_url","Game play url is required")
         .exists(),
      check("game_status","Genre status is required")
         .exists()
   ], admin.addgame_post)
   app.get("/superadmin/gamedelete/:id", admin.gamedelete)
   app.get("/superadmin/gameupdate-:id", admin.gameeditlink)
   app.post("/superadmin/gameupdate-:id",[
      check("game_name","Game name is required")
         .exists()
         .isLength({max:30,min:2}),
      check("genre_id","Genre is required")
         .exists()
         .isNumeric(),
      check("game_description","Description is required")
         .exists()
         .isLength({max:300,min:2}),
      check("game_cover_url","Game cover url is required")
         .exists(),
      check("game_play_url","Game play url is required")
         .exists(),
      check("game_status","Genre status is required")
         .exists()
   ], admin.gameupdate)
   app.get("/superadmin/game", admin.gameview)

   app.get("/superadmin/competecreate", admin.leaderboardgamecreate)
   app.post("/superadmin/competecreate",[
      check("game_name","Game name is required")
         .exists()
         .isLength({max:30,min:2}),
      check("genre_id","Genre is required")
         .exists()
         .isNumeric(),
      check("entry_tokens","Entry Token is required")
         .exists()
         .isNumeric(),
      check("game_description","Description is required")
         .exists()
         .isLength({max:300,min:2}),
      check("game_cover_url","Game cover url is required")
         .exists(),
      check("game_play_url","Game play url is required")
         .exists(),
      check("game_status","Genre status is required")
         .exists()
   ], admin.leaderboardgamecreate_post)
   app.get("/superadmin/leaderboardgameupdate-:id", admin.leaderboardgameeditlink)
   app.post("/superadmin/leaderboardgameupdate-:id",[
      check("game_name","Game name is required")
         .exists()
         .isLength({max:30,min:2}),
      check("genre_id","Genre is required")
         .exists()
         .isNumeric(),
      check("entry_tokens","Entry Token is required")
         .exists()
         .isNumeric(),
      check("game_description","Description is required")
         .exists()
         .isLength({max:300,min:2}),
      check("game_cover_url","Game cover url is required")
         .exists(),
      check("game_play_url","Game play url is required")
         .exists(),
      check("game_status","Genre status is required")
         .exists()
   ], admin.leaderboardgameupdate)
   app.get("/superadmin/leaderboardgamedelete/:id", admin.leaderboardgamedelete)



   app.get("/superadmin/compete", admin.leaderboardgameview)
   app.get("/superadmin/user", admin.users)
   app.get("/superadmin/settings", admin.settings)
   app.post("/superadmin/signupbonus",[
      check("key","Key is required")
         .exists()
         .isLength({max:30,min:2}),
      check("SignupBonus","Signup bonus required")
         .exists()
         .isNumeric(),
   ], admin.signupbonus)
   app.post("/superadmin/referralbonus",[
      check("ReferralBonus","Referral Bonus bonus required")
         .exists()
         .isNumeric(),
   ], admin.referralbonus)
   app.post("/superadmin/leaderboardduration",[
      check("FromDate","FromDate is required")
         .exists()
         .isLength({min:3}),
         
      check("ToDate","ToDate is required")
         .exists()
         .isLength({min:3}),
   ], admin.leaderboard_duration)

   app.get("/superadmin/leaderboard", admin.referandwin)





}