const { validationResult, body } = require("express-validator");
const md5 = require("md5");
const sqlConnect = require("../../config/dbconnection");
const store = require("store2")

// Dashboard ########################
const dashboard = (req,res) =>{
    var user = store.get("user")
    if(user == null || user == "" || user == undefined){
        return res.redirect('../superadmin/login');
    }
    res.render("admin/index.ejs",{ title : "GiroGamez Superadmin Panel - KT Gamez powered by GiroGames" });
}


// Login System ################################
const login = (req,res) =>{
    res.render("admin/login.ejs",{alert:[]});
}

const login_post = async (req,res) =>{
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/login.ejs",{alert})
    }

    const connection = await sqlConnect()
    var [result,field] = await connection.query("SELECT * FROM `super_admins` WHERE `email`='"+req.body.email+"' AND `password`='"+md5(req.body.password)+"'")
    if(result.length===0){
        alert = [
            {
                msg:"Invalid username or password"
            }
        ]
        return res.render("admin/login.ejs",{alert})
    }
    await store.set("user",encodeURI(result[0].id))
    res.redirect('/superadmin/');
}

// Logout ################################
const logout = async (req,res) =>{
    store.remove("user")
    res.redirect("/superadmin/login");
}

// forgot password ################################
const forgotpassword = (req,res) =>{
    res.render("admin/forget-password.ejs");
}

// Genre Management ###############################
const grnrecreate = (req,res) =>{
    res.render("admin/addgamegenre.ejs",{alert:[]});
}

const grnrecreate_post = async (req,res) =>{
    
    const errors = validationResult(req);
    console.log(errors)
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/addgamegenre.ejs",{alert})
    }
    const connection = await sqlConnect()

    var [result,field] = await connection.query("SELECT `id` FROM `game_genres` WHERE `genre_name`='"+req.body.genre_name+"'")
    if(result.length !== 0){
        alert = [
            {
                msg:"Genre already exist"
            }
        ]
        return res.render("admin/addgamegenre.ejs",{alert})
    }
    
    await connection.query("INSERT INTO `game_genres` SET `genre_name`='"+req.body.genre_name+"',`genre_description`='"+req.body.description+"',`genre_status`='"+req.body.genre_status+"',`created_at`=CURRENT_TIMESTAMP(),`updated_at`=CURRENT_TIMESTAMP()")
    res.redirect("genreview");
    connection.end();
}

const genrelist = async (req,res) =>{
    const connection = await sqlConnect();
    var [result,field] = await connection.query("SELECT * FROM `game_genres`")

    var deletegenre = store.get("deletegenre") || false;
    var updategenre = store.get("updategenre") || false;

    
    if(deletegenre){
        store.remove("deletegenre");
    }
    if(updategenre){
        store.remove("updategenre");
    }
    
    res.render("admin/viewgamegenre.ejs",{genre:result,delete_data:deletegenre,update_data:updategenre});
}

const genredelete = async (req,res) =>{
    if(req.params.id=='' || req.params.id==null || req.params.id==undefined){
        return res.redirect("../superadmin/");
    }

    const connection = await sqlConnect();

    await connection.query("DELETE FROM `game_genres` WHERE `id`='"+req.params.id+"'");
    store.set("deletegenre",true)
    res.redirect("/superadmin/genreview")
    connection.end();
}

const genreeditlink = async (req,res) =>{
    if(req.params.id=='' || req.params.id==null || req.params.id==undefined){
        return res.redirect("/superadmin/")
    }
    const connection = await sqlConnect();
    
    var [result,field] = await connection.query("SELECT * FROM `game_genres` WHERE `id`='"+req.params.id+"'");

    if(result.length === 0){
        return res.redirect("/superadmin/")
    }
    
    res.render("admin/genreedit.ejs",{alert:[],data:result[0]});

    connection.end()
}

const genreupdate = async (req,res) =>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/genreedit.ejs",{alert,data:req.body})
    }
    const connection = await sqlConnect()

    var [result,field] = await connection.query("SELECT `id` FROM `game_genres` WHERE `genre_name`='"+req.body.genre_name+"' AND  `id`!='"+req.params.id+"'")
    if(result.length !== 0){
        alert = [
            {
                msg:"Genre already exist"
            }
        ]
        return res.render("admin/genreedit.ejs",{alert,data:req.body})
    }
    
    await connection.query("UPDATE `game_genres` SET `genre_name`='"+req.body.genre_name+"',`genre_description`='"+req.body.description+"',`genre_status`='"+req.body.genre_status+"',`created_at`=CURRENT_TIMESTAMP(),`updated_at`=CURRENT_TIMESTAMP() WHERE  `id`='"+req.params.id+"'")
    store.set("updategenre",true)
    res.redirect("genreview");
    connection.end();
   
}

// Game Management ###############################
const addgame = async (req,res) =>{
    const connection = await sqlConnect();
    var [result,field] = await connection.query("SELECT * FROM `game_genres` WHERE `genre_status`='Active'");
    connection.end()

    res.render("admin/gamecreate.ejs",{alert:[],game_genre:result});
}

const addgame_post = async (req,res) =>{

    const connection = await sqlConnect()

    var [result,field] = await connection.query("SELECT * FROM `game_genres` WHERE `genre_status`='Active'")

    const errors = validationResult(req);
    console.log(errors)
    console.log(req.body)
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/gamecreate.ejs",{alert,game_genre:result})
    }
    

     var [result,field] = await connection.query("SELECT `id` FROM `giro_games` WHERE `game_name`='"+req.body.game_name+"'")
    if(result.length !== 0){
        alert = [
            {
                msg:"Game already exist"
            }
        ]
        return res.render("admin/addgamegenre.ejs",{alert:[],game_genre:result})
    }
    await connection.query("INSERT INTO `giro_games` SET `game_name`='"+req.body.game_name+"',`genre_id`='"+req.body.genre_id+"',`game_description`='"+req.body.game_description+"',`game_cover_url`='"+req.body.game_cover_url+"',`game_play_url`='"+req.body.game_play_url+"',`game_status`='"+req.body.game_status+"',`created_at`=CURRENT_TIMESTAMP(),`updated_at`=CURRENT_TIMESTAMP()")
    res.redirect("game");
    connection.end();
}

const gameview = async (req,res) =>{

    var gamedelete = store.get("gamedelete") || false;
    var gameupdate = store.get("gameupdate") || false;

    
    if(gamedelete){
        store.remove("gamedelete");
    }
    if(gameupdate){
        store.remove("gameupdate");
    }

    const connection = await sqlConnect();

    var [result,field] = await connection.query("SELECT `giro_games`.*,`game_genres`.`genre_name` FROM `giro_games` LEFT JOIN `game_genres` ON `giro_games`.`genre_id`=`game_genres`.`id` ORDER BY `giro_games`.`id` DESC")

    connection.end();
    res.render("admin/gameview.ejs",{games:result,delete_data:gamedelete,update_data:gameupdate});
}

const gamedelete = async (req,res) =>{
    if(req.params.id=='' || req.params.id==null || req.params.id==undefined){
        return res.redirect("../superadmin/");
    }

    const connection = await sqlConnect();

    await connection.query("DELETE FROM `giro_games` WHERE `id`='"+req.params.id+"'");
    store.set("gamedelete",true)
    res.redirect("/superadmin/game")
    connection.end();
}

const gameeditlink = async (req,res) =>{
    if(req.params.id=='' || req.params.id==null || req.params.id==undefined){
        return res.redirect("/superadmin/")
    }
    const connection = await sqlConnect();
    var [result2,field2] = await connection.query("SELECT * FROM `game_genres`")
    var [result,field] = await connection.query("SELECT * FROM `giro_games` WHERE `id`='"+req.params.id+"'");

    if(result.length === 0){
        return res.redirect("/superadmin/")
    }
    
    res.render("admin/gameedit.ejs",{alert:[],game_genre:result2,game_data:result[0]});

    connection.end()
}

const gameupdate = async (req,res) =>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/gameedit.ejs",{alert,data:req.body})
    }
    const connection = await sqlConnect()

    var [result,field] = await connection.query("SELECT `id` FROM `giro_games` WHERE `game_name`='"+req.body.gane_name+"' AND  `id`!='"+req.params.id+"'")
    if(result.length !== 0){
        alert = [
            {
                msg:"Game already exist"
            }
        ]
        return res.render("admin/genreedit.ejs",{alert,data:req.body})
    }
    
    await connection.query("UPDATE `giro_games` SET `game_name`='"+req.body.game_name+"',`genre_id`='"+req.body.genre_id+"',`game_description`='"+req.body.game_description+"',`game_cover_url`='"+req.body.game_cover_url+"',`game_play_url`='"+req.body.game_play_url+"',`game_status`='"+req.body.game_status+"' WHERE `id`='"+req.params.id+"'")
    store.set("gameupdate",true)
    res.redirect("game");
    connection.end();
   
}

// Leaderboard Games Management ########################
const leaderboardgamecreate = async (req,res) =>{

    const connection = await sqlConnect();
    var [result,field] = await connection.query("SELECT * FROM `game_genres` WHERE `genre_status`='Active'");
    connection.end()

    res.render("admin/leaderboardgamecreate.ejs",{alert:[],game_genre:result});
}

const leaderboardgamecreate_post = async (req,res) =>{
    const connection = await sqlConnect()

    var [result,field] = await connection.query("SELECT * FROM `game_genres` WHERE `genre_status`='Active'")

    const errors = validationResult(req);
    console.log(errors)
    console.log(req.body)
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/leaderboardgamecreate.ejs",{alert,game_genre:result})
    }
    

     var [result,field] = await connection.query("SELECT `id` FROM `compete_games` WHERE `game_name`='"+req.body.game_name+"'")
    if(result.length !== 0){
        alert = [
            {
                msg:"Game already exist"
            }
        ]
        return res.render("admin/addgamegenre.ejs",{alert:[],game_genre:result})
    }
    await connection.query("INSERT INTO `compete_games` SET `game_name`='"+req.body.game_name+"',`genre_id`='"+req.body.genre_id+"',`game_description`='"+req.body.game_description+"',`entry_tokens`='"+req.body.entry_tokens+"',`game_cover_url`='"+req.body.game_cover_url+"',`game_play_url`='"+req.body.game_play_url+"',`game_status`='"+req.body.game_status+"',`created_at`=CURRENT_TIMESTAMP(),`updated_at`=CURRENT_TIMESTAMP()")
    res.redirect("compete");
    connection.end();
}

const leaderboardgameview = async (req,res) =>{
    var gamedelete = store.get("gamedelete") || false;
    var gameupdate = store.get("gameupdate") || false;

    
    if(gamedelete){
        store.remove("gamedelete");
    }
    if(gameupdate){
        store.remove("gameupdate");
    }

    const connection = await sqlConnect();

    var [result,field] = await connection.query("SELECT `compete_games`.*,`game_genres`.`genre_name` FROM `compete_games` LEFT JOIN `game_genres` ON `compete_games`.`genre_id`=`game_genres`.`id` ORDER BY `compete_games`.`id` DESC")

    connection.end();
    res.render("admin/leaderboardgameview.ejs",{games:result,delete_data:gamedelete,update_data:gameupdate});

}

const leaderboardgamedelete = async (req,res) =>{
    if(req.params.id=='' || req.params.id==null || req.params.id==undefined){
        return res.redirect("../superadmin/");
    }

    const connection = await sqlConnect();

    await connection.query("DELETE FROM `compete_games` WHERE `id`='"+req.params.id+"'");
    store.set("gamedelete",true)
    res.redirect("/superadmin/compete")
    connection.end();
}

const leaderboardgameeditlink = async (req,res) =>{
    if(req.params.id=='' || req.params.id==null || req.params.id==undefined){
        return res.redirect("/superadmin/")
    }
    const connection = await sqlConnect();
    var [result2,field2] = await connection.query("SELECT * FROM `game_genres`")
    var [result,field] = await connection.query("SELECT * FROM `compete_games` WHERE `id`='"+req.params.id+"'");

    if(result.length === 0){
        return res.redirect("/superadmin/")
    }
    
    res.render("admin/leaderboardgameedit.ejs",{alert:[],game_genre:result2,game_data:result[0]});

    connection.end()
}

const leaderboardgameupdate = async (req,res) =>{
    
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/leaderboardgameedit.ejs",{alert,data:req.body})
    }
    const connection = await sqlConnect()

    var [result,field] = await connection.query("SELECT `id` FROM `compete_games` WHERE `game_name`='"+req.body.gane_name+"' AND  `id`!='"+req.params.id+"'")
    if(result.length !== 0){
        alert = [
            {
                msg:"Game already exist"
            }
        ]
        return res.render("admin/genreedit.ejs",{alert,data:req.body})
    }
    
    await connection.query("UPDATE `compete_games` SET `game_name`='"+req.body.game_name+"',`genre_id`='"+req.body.genre_id+"',`game_description`='"+req.body.game_description+"',`entry_tokens`='"+req.body.entry_tokens+"',`game_cover_url`='"+req.body.game_cover_url+"',`game_play_url`='"+req.body.game_play_url+"',`game_status`='"+req.body.game_status+"' WHERE `id`='"+req.params.id+"'")
    store.set("gameupdate",true)
    res.redirect("compete");
    connection.end();
   
}


// Users Management #######################################
const users = async (req,res) =>{
    const connection = await sqlConnect();
    var [result,field] = await connection.query("SELECT * FROM `users`")
    connection.end();
    res.render("admin/users.ejs",{users:result})
}

// Settings Management
const settings = async (req,res) =>{
    const connection = await sqlConnect();
    var [result,field] = await connection.query("SELECT * FROM `user_settings`")
    
    var date = JSON.parse(result[2].value)
    
    connection.end();
    res.render("admin/settings.ejs",{data:result,alert:[]})
}

const signupbonus = async (req,res) =>{
    const connection = await sqlConnect();
    var [result,field] = await connection.query("SELECT * FROM `user_settings`")

    const errors = validationResult(req);
    console.log(errors)
    console.log(req.body)
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/settings.ejs",{data:result,alert})
    }
    
    var [result,field] = await connection.query("UPDATE `user_settings` SET `value`='"+req.body.SignupBonus+"' WHERE `key`='Signup Bonus'")
    
    res.redirect("settings")
    connection.end();
    
}

const referralbonus = async (req,res) =>{
    const connection = await sqlConnect();
    var [result,field] = await connection.query("SELECT * FROM `user_settings`")

    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/settings.ejs",{data:result,alert})
    }
    
    var [result,field] = await connection.query("UPDATE `user_settings` SET `value`='"+req.body.ReferralBonus+"' WHERE `key`='Referral Bonus'")
    
    res.redirect("settings")
    connection.end();
    
}
const leaderboard_duration = async (req,res) =>{
    const connection = await sqlConnect();
    var [result,field] = await connection.query("SELECT * FROM `user_settings`")

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const alert = errors.array()
        return res.render("admin/settings.ejs",{data:result,alert})
    }
    console.log((req.body.FromDate).toString())
    value = '{"FromDate":"'+(req.body.FromDate).toString()+'","ToDate":"'+(req.body.ToDate).toString()+'"}'
    console.log(value)
    var [result,field] = await connection.query("UPDATE `user_settings` SET `value`='"+value+"' WHERE `key`='LeaderBoard Duration'")
    
    res.redirect("settings")
    connection.end();
    
}
const referandwin = (req,res) =>{
    res.render("admin/referandwin.ejs")
}

module.exports = {
    dashboard,

    login,
    login_post,
    logout,

    forgotpassword,

    grnrecreate,
    grnrecreate_post,
    genrelist,
    genredelete,
    genreeditlink,
    genreupdate,

    addgame,
    addgame_post,
    gameview,
    gamedelete,
    gameeditlink,
    gameupdate,


    leaderboardgamecreate,
    leaderboardgamecreate_post,
    leaderboardgameview,
    leaderboardgamedelete,
    leaderboardgameeditlink,
    leaderboardgameupdate,


    users,
    settings,
    signupbonus,
    referralbonus,
    leaderboard_duration,


    referandwin,
    
}