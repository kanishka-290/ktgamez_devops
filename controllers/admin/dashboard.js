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

// Genre Management ########################
const grnrecreate = (req,res) =>{
    res.render("admin/addgamegenre.ejs",{alert:[]});
}
const grnrecreate_post = async (req,res) =>{
    console.log(req.body)
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
}

const genrelist = (req,res) =>{
    res.render("admin/viewgamegenre.ejs")
}
const addgame = (req,res) =>{
    res.render("admin/gamecreate.ejs");
}
const gameview = (req,res) =>{
    res.render("admin/gameview.ejs");
}
const leaderboardgamecreate = (req,res) =>{
    res.render("admin/leaderboardgamecreate.ejs");
}
const leaderboardgameview = (req,res) =>{
    res.render("admin/leaderboardgameview.ejs");

}
const users = (req,res) =>{
    res.render("admin/users.ejs")
}

const settings = (req,res) =>{
    res.render("admin/settings.ejs")
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

    addgame,
    gameview,
    leaderboardgamecreate,
    leaderboardgameview,
    users,
    settings,
    referandwin,
    
}