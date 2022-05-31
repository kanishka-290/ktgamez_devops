const dashboard = (req,res) =>{
    res.render("admin/index.ejs",{ title : "GiroGamez Superadmin Panel - KT Gamez powered by GiroGames" });
}
const login = (req,res) =>{
    res.render("admin/login.ejs");
}
const grnrecreate = (req,res) =>{
    res.render("admin/addgamegenre.ejs");
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
    grnrecreate,
    genrelist,
    addgame,
    gameview,
    leaderboardgamecreate,
    leaderboardgameview,
    users,
    settings,
    referandwin,
}